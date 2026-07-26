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

    async def connect(self, websocket: WebSocket, room_code: str, expected_players: int = 2):
        await websocket.accept()
        if room_code not in active_rooms:
            # First player sets the expected players for this room
            active_rooms[room_code] = {"connections": [], "expected_players": expected_players}
        
        room = active_rooms[room_code]
        
        # Max players per room
        if len(room["connections"]) >= room["expected_players"]:
            await websocket.send_json({"type": "error", "message": "Room is full"})
            await websocket.close()
            return False

        room["connections"].append(websocket)
        
        # If expected players are now in the room, notify all that the game can start
        if len(room["connections"]) == room["expected_players"]:
            await self.broadcast(room_code, {"type": "game_start", "message": "All players joined. Game starting!"})
            
            # Send player assignments
            for i, conn in enumerate(room["connections"]):
                await conn.send_json({"type": "player_assignment", "player": i + 1})
            
        return True

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in active_rooms:
            room = active_rooms[room_code]
            if websocket in room["connections"]:
                room["connections"].remove(websocket)
                if len(room["connections"]) == 0:
                    del active_rooms[room_code]

    async def broadcast(self, room_code: str, message: dict):
        if room_code in active_rooms:
            for connection in active_rooms[room_code]["connections"]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str, expected_players: int = 2):
    room_code = room_code.upper()
    connected = await manager.connect(websocket, room_code, expected_players)
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
