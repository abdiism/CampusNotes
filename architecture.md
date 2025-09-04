# Architectural Overview: CampusNotes Application

**1. Introduction:**
    *   Brief overview of the CampusNotes application (a platform for users to upload, search, and view notes).
    *   Purpose of this architectural document.

**2. High-Level System Architecture:**
    *   A Mermaid diagram illustrating the overall system, showing the Client (React Frontend), Server (Node.js/Express Backend), and Database (MongoDB).
    *   Description of the main technology stack (React, Node.js, Express, MongoDB).

**3. Client-Side Architecture (React Frontend):**
    *   **3.1. Core Components:**
        *   `Header`: Navigation, user authentication status (derived from Redux state), logout functionality (dispatches `removeUserData`).
        *   `Footer`: Standard footer content.
        *   `SearchBar`: Allows users to search for notes, displays results, includes `NoteModal` for viewing note details.
        *   `UploadNote`: Form for users to upload new notes.
    *   **3.2. Pages (Views):**
        *   `Home`: Landing page, possibly showcasing featured notes or benefits.
        *   `Login`: User login form. On successful login, dispatches `setUserData` with user details.
        *   `Signup`: User registration form. On successful registration and login, dispatches `setUserData`.
        *   `Profile`: User profile page, displays user's uploaded notes (potentially fetched based on `userData` from Redux), allows viewing (via `NoteModal`) and deleting notes (via `DeleteConfirmModal`).
        *   `Upload`: Page dedicated to the `UploadNote` component.
        *   `Search`: Page dedicated to displaying search results (likely utilizing `SearchBar`).
        *   `About`: Information about the application.
        *   `Faq`: Frequently Asked Questions.
    *   **3.3. State Management (Redux Toolkit):**
        *   **Store Configuration (`client/src/Redux/store.js`):**
            *   Uses `configureStore` from Redux Toolkit.
            *   Combines reducers using `combineReducers`. Currently, only the `userReducer` is integrated.
        *   **User Slice (`client/src/Redux/slices/user-slice.js`):**
            *   **Name:** "user"
            *   **Initial State:**
                *   `userData: null` (to store details of the logged-in user)
                *   `isAuthenticated: false` (boolean flag indicating authentication status)
            *   **Actions/Reducers:**
                *   `setUserData(state, action)`: Sets `state.userData` to `action.payload` (containing user details from the server) and sets `state.isAuthenticated` to `true`. Typically dispatched after successful login or signup.
                *   `removeUserData(state)`: Resets `state.userData` to `null` and `state.isAuthenticated` to `false`. Typically dispatched on logout.
            *   **Selectors:**
                *   `selectUserData(state)`: Returns the current `state.user.userData`.
                *   `selectIsAuthenticated(state)`: Returns the current `state.user.isAuthenticated`.
        *   **Usage:** Components like `Header` would use `selectIsAuthenticated` to conditionally render UI elements (e.g., "Login/Signup" vs. "Profile/Logout"). Pages like `Login` and `Signup` would dispatch `setUserData` upon successful authentication. The `Header`'s logout button would dispatch `removeUserData`.
    *   **3.4. Client-Server Interaction:**
        *   How the client makes API calls to the server (e.g., using `axios` as seen in `UploadNote` and `Signup` components).
        *   Key data flows:
            *   User Authentication (Login/Signup) -> updates Redux state.
            *   Note Upload
            *   Note Search & Retrieval
            *   Note Deletion
            *   Profile Management (may rely on `userData` from Redux).

**4. Server-Side Architecture (Node.js/Express Backend):**
    *   **4.1. API Endpoints & Controllers:**
        *   `AuthController`:
            *   `POST /api/auth/signup`: Handles user registration.
            *   `POST /api/auth/login`: Handles user login.
        *   `NotesController`:
            *   `POST /api/notes/upload`: Handles note uploads.
            *   `GET /api/notes/`: Retrieves notes (likely with search/filter capabilities).
            *   `GET /api/notes/:id`: Retrieves a specific note by ID.
            *   `DELETE /api/notes/:id`: Deletes a specific note by ID.
            *   `PUT /api/notes/view/:id`: Increments the view count of a note.
        *   (Note: Actual API routes would be defined in `server/Routes/auth.js` and `server/Routes/notes.js`, which I'll assume map to these controller functions).
    *   **4.2. Data Models (Mongoose Schemas):**
        *   `User`: `firstName`, `lastName`, `userBio`, `userEmail`, `userMobile`, `userName`, `userPassword`, `profileImage`.
        *   `Note`: `fileName`, `tags`, `noteContent`, `subject`, `course`, `semester`, `university`, `fileType`, `fileSize`, `viewCount`, `uploadedBy` (references User), `createdAt`, `updatedAt`.
    *   **4.3. Database Interaction:**
        *   Mongoose ODM for interacting with MongoDB.
        *   Storage of user credentials and note data.
    *   **4.4. File Handling:**
        *   The `server/files/` directory suggests that uploaded note files are stored directly on the server's file system. The path to these files is likely stored in the `Note` model.

**5. Data Flow Diagrams (Mermaid):**
    *   **5.1. User Signup/Login Flow (including Redux):**
        ```mermaid
        sequenceDiagram
            participant ClientUI
            participant ReduxStore
            participant Server
            participant Database

            ClientUI->>Server: POST /api/auth/signup (userData)
            Server->>Database: Create User (userData)
            Database-->>Server: User Created (userDetails)
            Server-->>ClientUI: Success Response (userDetails, JWT Token)
            ClientUI->>ReduxStore: dispatch(setUserData(userDetails))
            ReduxStore-->>ClientUI: State Updated (isAuthenticated: true)

            ClientUI->>Server: POST /api/auth/login (credentials)
            Server->>Database: Find User (credentials)
            Database-->>Server: User Found (userDetails) / Not Found
            alt User Found
                Server-->>ClientUI: Success Response (userDetails, JWT Token)
                ClientUI->>ReduxStore: dispatch(setUserData(userDetails))
                ReduxStore-->>ClientUI: State Updated (isAuthenticated: true)
            else User Not Found
                Server-->>ClientUI: Error Response
            end
        ```
    *   **5.2. Note Upload Flow:**
        ```mermaid
        sequenceDiagram
            participant Client
            participant Server
            participant Database
            participant FileSystem

            Client->>Server: POST /api/notes/upload (noteData, file)
            Server->>FileSystem: Save file
            FileSystem-->>Server: File saved (path)
            Server->>Database: Create Note (noteData with filePath, uploadedBy)
            Database-->>Server: Note Created
            Server-->>Client: Success Response
        ```
    *   **5.3. Note Search and View Flow:**
        ```mermaid
        sequenceDiagram
            participant Client
            participant Server
            participant Database

            Client->>Server: GET /api/notes/ (searchQuery)
            Server->>Database: Find Notes (searchQuery)
            Database-->>Server: Notes List
            Server-->>Client: Notes List

            Client->>Server: GET /api/notes/:id (view note)
            Server->>Database: Find Note by ID
            Database-->>Server: Note Details
            Server-->>Client: Note Details
            Server->>Server: PUT /api/notes/view/:id (increment view)
            Server->>Database: Update Note viewCount
            Database-->>Server: View Count Updated
        ```

**6. Future Considerations / Potential Improvements (Optional):**
    *   Scalability of file storage (e.g., using cloud storage like S3).
    *   Enhanced search capabilities (e.g., full-text search).
    *   Security enhancements.
    *   Expanding Redux store for other global states (e.g., notes list, search results, loading states).