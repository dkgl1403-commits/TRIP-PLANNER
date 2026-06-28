# Requirements Document

## Introduction

This document outlines the requirements for a mobile-friendly event planning application that supports outdoor trips, birthday celebrations, and marriage celebrations. The app connects to an Oracle database server and supports multiple user roles including Admin, Participant, and Trip Planner.

## Glossary

- **Event Planning App**: The mobile application for planning and managing events
- **Admin**: User role with privileges to create and manage users in the system
- **Participant**: User who registers using an access code to join events
- **Trip Planner**: User role responsible for organizing and managing events
- **Event**: A planned occurrence such as an outdoor trip, birthday celebration, or marriage celebration
- **Checkpoint**: Specific location or milestone along an event route
- **Activation Code**: Unique code generated for participants after accepting an invitation
- **Location Sharing**: Real-time tracking of participant locations during events

## Requirements

### Requirement 1: User Authentication and Management

**User Story:** As an Admin, I want to create and manage user accounts, so that only authorized personnel can access the system.

#### Acceptance Criteria

1. THE Admin Login SHALL authenticate using secure credentials
2. WHILE authenticated, THE Admin SHALL be able to create new user accounts for Participants and Trip Planners
3. WHILE authenticated, THE Admin SHALL be able to view a list of all registered users
4. IF an invalid login attempt is made, THEN THE System SHALL display an appropriate error message

### Requirement 2: Participant Registration

**User Story:** As a Participant, I want to register for an event using an access code, so that I can join the event without needing direct administrator approval.

#### Acceptance Criteria

1. WHEN a Participant enters a valid access code, THE System SHALL register the Participant for the associated event
2. WHEN a Participant enters an invalid access code, THE System SHALL return a descriptive error message
3. WHILE registration is in progress, THE System SHALL maintain Participant data securely
4. IF registration fails due to network issues, THEN THE System SHALL retry the registration up to three times before displaying an error

### Requirement 3: Trip Planner Event Creation

**User Story:** As a Trip Planner, I want to create events with specific details, so that Participants can be informed about the event.

#### Acceptance Criteria

1. WHEN a Trip Planner selects an event type, THE System SHALL provide input fields for the following: Event Title, Description, Starting Location, Destination, Checkpoints
2. THE Trip Planner SHALL be able to enter multiple checkpoints with location details
3. WHILE entering event details, THE System SHALL validate required fields before submission
4. WHEN an event is created successfully, THE System SHALL save it to the Oracle database

### Requirement 4: Participant Information Management

**User Story:** As a Trip Planner, I want to manage participant information for my events, so that I can keep accurate attendance records.

#### Acceptance Criteria

1. WHILE managing an event, THE Trip Planner SHALL be able to add participant names and mobile numbers
2. WHILE managing an event, THE Trip Planner SHALL be able to view the total participant count
3. WHILE managing an event, THE Trip Planner SHALL be able to delete participant records
4. THE Participant Count SHALL update automatically when participants are added or removed

### Requirement 5: Invitation and Notification System

**User Story:** As a Participant, I want to receive event invitations through multiple channels, so that I can be informed about events I'm invited to.

#### Acceptance Criteria

1. WHEN an event is created, THE System SHALL send invitations to registered participants via SMS, WhatsApp, or email
2. THE invitation SHALL include event title, date, starting location, and destination
3. WHEN a Participant receives an invitation, THE System SHALL provide options to Accept or Reject
4. WHEN a Participant accepts an invitation, THE System SHALL generate and deliver an activation code

### Requirement 6: Activation Code Management

**User Story:** As a Participant, I want to receive an activation code after accepting an invitation, so that I can access the app with event-specific permissions.

#### Acceptance Criteria

1. WHEN a Participant accepts an invitation, THE System SHALL generate a unique activation code
2. THE System SHALL deliver the activation code to the Participant via the same channel as the invitation
3. WHEN a Participant enters the activation code in the app, THE System SHALL validate it against the database
4. IF an invalid activation code is entered, THEN THE System SHALL return a descriptive error message

### Requirement 7: Event Reminders

**User Story:** As a Participant, I want to receive reminders before an event, so that I don't forget about the event.

#### Acceptance Criteria

1. WHEN an event is scheduled for the next day, THE System SHALL send a reminder via SMS, email, or WhatsApp
2. WHEN an event is scheduled for the same day, THE System SHALL send a final reminder via SMS, email, or WhatsApp
3. THE reminder SHALL include event title, starting time, location, and any additional relevant information

### Requirement 8: Trip Start and Location Sharing

**User Story:** As a Trip Planner, I want to start the journey on the trip day, so that real-time tracking can begin for all participants.

#### Acceptance Criteria

1. WHEN the Trip Planner initiates the trip start, THE System SHALL record the trip start time and status
2. WHILE a trip is active, THE System SHALL enable location sharing for all participants who have joined
3. WHEN a participant's location is updated, THE System SHALL share it with all other participants (with permissions)
4. THE Location Sharing Feature SHALL respect user privacy settings and require explicit consent

### Requirement 9: Checkpoint Progress Tracking

**User Story:** As a Trip Planner, I want to track which participants have reached each checkpoint, so that I can monitor the group's progress.

#### Acceptance Criteria

1. WHEN a participant reaches a checkpoint, THE System SHALL record the checkpoint time and participant location
2. THE Trip Planner SHALL be able to view real-time checkpoint status for all participants
3. WHILE a checkpoint is marked as reached, THE System SHALL update the participant's progress status
4. IF a participant fails to reach a checkpoint within the expected time, THE System SHALL generate an alert for the Trip Planner

### Requirement 10: Communication Features

**User Story:** As a Participant or Trip Planner, I want to communicate with other event participants, so that I can coordinate and share information.

#### Acceptance Criteria

1. WHILE an event is active, THE System SHALL provide a group chat option for all participants
2. WHILE an event is active, THE System SHALL provide individual chat options between any two participants
3. THE System SHALL store chat messages securely in the Oracle database
4. WHEN a new message is sent, THE System SHALL deliver it to all intended recipients

### Requirement 11: Oracle Database Integration

**User Story:** As a system component, I want to connect to an Oracle database server, so that all event data, user information, and communications are persisted reliably.

#### Acceptance Criteria

1. THE System SHALL connect to the Oracle database server using secure authentication
2. WHEN data is created, modified, or deleted, THE System SHALL persist changes to the Oracle database
3. WHILE connecting to the database, THE System SHALL handle connection failures gracefully
4. ALL database operations SHALL use parameterized queries to prevent SQL injection attacks

### Requirement 12: Mobile-Friendly Design

**User Story:** As a user, I want to use the app on mobile devices, so that I can access event information on-the-go.

#### Acceptance Criteria

1. THE User Interface SHALL be responsive and functional on both iOS and Android mobile devices
2. WHILE using the app on a mobile device, THE System SHALL optimize touch interactions for mobile screens
3. THE App Shall load within 3 seconds on a standard mobile network connection
4. IF network connectivity is lost, THE System SHALL cache data locally and sync when connection is restored