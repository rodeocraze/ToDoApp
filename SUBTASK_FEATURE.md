# Subtask Feature Implementation

## Overview
The subtask feature allows users to break down main tasks into smaller, manageable subtasks. Each subtask has all the same properties as a main task (title, description, dates, priority, etc.) but is linked to a parent task.

## Backend Implementation

### Models
- **Subtask.java**: Entity with same properties as Task but includes `parentTaskID` field
- Relationship: Subtask belongs to a User and references a parent Task via `parentTaskID`

### API Endpoints
- `POST /main/{taskID}/add/subtask` - Add subtask to a specific task
- `GET /main/{taskID}/subtasks` - Get all subtasks for a specific task
- `GET /main/subtasks` - Get all subtasks for current user
- `GET /main/subtasks/{subtaskID}` - Get specific subtask by ID
- `PUT /main/subtasks/update` - Update a subtask
- `DELETE /main/subtasks/{subtaskID}` - Delete a subtask

### Services
- **SubtaskService.java**: Handles business logic for subtask operations
- **SubtaskRepo.java**: JPA repository for database operations

## Frontend Implementation

### Components
1. **SubtaskForm.jsx**: Form component for adding new subtasks
2. **SubtaskList.jsx**: Displays list of subtasks with management actions
3. **TaskDetailPage.jsx**: Updated to include subtask functionality

### API Integration
- **subtaskAPI**: New API service in `api.js` with all subtask endpoints
- Error handling and loading states for all operations
- Real-time updates when subtasks are added, modified, or deleted

### Features
- Add subtasks with full form validation
- Display subtasks in organized cards
- Toggle completion status
- Archive/unarchive subtasks
- Delete subtasks with confirmation dialog
- Priority badges and status indicators
- Date and time formatting
- Responsive design for mobile devices

## Usage

1. Navigate to any task detail page
2. Scroll to the "Subtasks" section
3. Click "Add Subtask" to create a new subtask
4. Fill in the subtask details (title is required)
5. Submit the form to add the subtask
6. Manage subtasks using the action buttons:
   - Mark Complete/Incomplete
   - Archive/Unarchive
   - Delete (with confirmation)

## Data Structure

```json
{
  "id": 1,
  "parentTaskID": 5,
  "title": "Research libraries",
  "description": "Look into React component libraries",
  "category": "Development",
  "priority": true,
  "completed": false,
  "archived": false,
  "startDate": "2024-01-15",
  "dueDate": "2024-01-20",
  "startTime": "09:00",
  "endTime": "11:00",
  "createdDate": "2024-01-10",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

## Security
- All subtask operations require authentication
- Users can only access their own subtasks
- Subtasks inherit the same security model as main tasks
- Input validation on both frontend and backend

## Future Enhancements
- Nested subtasks (subtasks of subtasks)
- Bulk operations on multiple subtasks
- Progress tracking based on subtask completion
- Subtask templates for common workflows
- Integration with calendar view 