import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

# Dictionary to hold active game rooms.
# Format: { "room_code": [WebSocket1, WebSocket2] }
active_rooms: Dict[str, List[WebSocket]] = {}

class ConnectionManager:
    def __init__(self):
        pass

    async def connect(self, websocket: WebSocket, room_code: str):
        await websocket.accept()
        if room_code not in active_rooms:
            active_rooms[room_code] = []
        
        # Max 2 players per room
        if len(active_rooms[room_code]) >= 2:
            await websocket.send_json({"type": "error", "message": "Room is full"})
            await websocket.close()
            return False

        active_rooms[room_code].append(websocket)
        
        # If 2 players are now in the room, notify both that the game can start
        if len(active_rooms[room_code]) == 2:
            await self.broadcast(room_code, {"type": "game_start", "message": "Opponent joined. Game starting!"})
            
            # Send player assignments
            await active_rooms[room_code][0].send_json({"type": "player_assignment", "player": 1})
            await active_rooms[room_code][1].send_json({"type": "player_assignment", "player": 2})
            
        return True

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in active_rooms and websocket in active_rooms[room_code]:
            active_rooms[room_code].remove(websocket)
            if len(active_rooms[room_code]) == 0:
                del active_rooms[room_code]

    async def broadcast(self, room_code: str, message: dict):
        if room_code in active_rooms:
            for connection in active_rooms[room_code]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    room_code = room_code.upper()
    connected = await manager.connect(websocket, room_code)
    if not connected:
        return
        
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting a JSON string representing the move or action
            try:
                payload = json.loads(data)
                # Broadcast the move to everyone in the room
                await manager.broadcast(room_code, payload)
            except Exception as e:
                print(f"Error parsing websocket message: {e}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_code)
        await manager.broadcast(room_code, {"type": "player_disconnected", "message": "Opponent left the game."})
