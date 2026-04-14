# BreadBoxd Architecture Diagrams

These diagrams reflect the current Flutter app structure in `lib/`.

## Class Diagram

```mermaid
classDiagram
    class MyApp {
      -bool _loading
      -bool _isLoggedIn
      -ThemeMode _themeMode
      +build(BuildContext)
      -_bootstrap()
      -_handleLogin()
      -_handleLogout()
      -_toggleTheme()
    }

    class LoginScreen {
      +Future<void> Function() onLoginSuccess
      +ThemeMode themeMode
      +Future<void> Function() onToggleTheme
    }

    class AppShell {
      +Future<void> Function() onLogout
      +ThemeMode themeMode
      +Future<void> Function() onToggleTheme
    }

    class SessionService {
      +saveToken(String)
      +saveLoginEmail(String)
      +getLoginEmail()
      +saveResolvedUserId(String)
      +getResolvedUserId()
      +getToken()
      +logout()
      +isLoggedIn()
      +currentUserId()
      +tokenIdentity()
      +saveThemeMode(ThemeMode)
      +loadThemeMode()
    }

    class ApiService {
      +baseUrl
      +login(email, password)
      +register(firstName, lastName, username, email, password)
      +getAllPosts()
      +getPostById(postId)
      +getPostsByUser(userId)
      +getUserInfo(userId)
      +getAllUsers()
      +resolveCurrentUserId(forceRefresh)
      +getFollowing(userId)
      +getFriendActivity(userId)
      +getTrendingIngredients()
      +getSuggestedPosts(userId)
      +follow(followerId, followingId)
    }

    class HomeScreen
    class DiscoverScreen
    class NewPostScreen
    class SavedPostsScreen
    class ProfileScreen
    class CommunityScreen
    class ListsScreen
    class PostDetailScreen

    class Post {
      +String id
      +String authorId
      +String title
      +String description
      +List~String~ ingredients
      +List~String~ instructions
      +List~String~ tags
      +List~String~ imageUrls
      +List~String~ comments
      +Map~String,dynamic~ authorSnippet
      +double rating
      +double selfRating
      +DateTime createdAt
      +copyWith()
      +fromJson(Map~String,dynamic~)
    }

    class AppUser {
      +String id
      +String firstName
      +String lastName
      +String email
      +String username
      +String legacyId
      +String profilePictureUrl
      +int followerCount
      +int followingCount
      +int postCount
      +List~String~ savedPosts
      +String fullName
      +String initials
      +copyWith()
      +fromJson(Map~String,dynamic~)
    }

    class AppList {
      +String id
      +String userId
      +String name
      +List~String~ postIds
      +List~Post~ posts
      +DateTime createdAt
      +copyWith()
      +fromJson(Map~String,dynamic~)
    }

    class ActivityItem {
      +String postId
      +String postTitle
      +double postRating
      +DateTime createdAt
      +AppUser author
      +fromJson(Map~String,dynamic~)
    }

    class TrendingIngredient {
      +String name
      +int count
      +fromJson(Map~String,dynamic~)
    }

    MyApp --> SessionService : bootstrap/auth/theme
    MyApp --> LoginScreen : shows when logged out
    MyApp --> AppShell : shows when logged in

    LoginScreen --> ApiService : login()
    AppShell --> SessionService : currentUserId()
    AppShell --> HomeScreen
    AppShell --> DiscoverScreen
    AppShell --> NewPostScreen
    AppShell --> SavedPostsScreen
    AppShell --> ProfileScreen
    AppShell --> CommunityScreen
    AppShell --> ListsScreen
    AppShell --> PostDetailScreen

    ApiService --> SessionService : token + user identity cache
    ApiService --> Post : maps API responses
    ApiService --> AppUser : maps API responses
    ApiService --> AppList : maps API responses
    ApiService --> ActivityItem : maps API responses
    ApiService --> TrendingIngredient : maps API responses

    AppList --> Post : contains
    ActivityItem --> AppUser : author
```

## Sequence Diagram

This sequence shows the main startup and login flow that leads into the tabbed app shell.

```mermaid
sequenceDiagram
    actor User
    participant MyApp
    participant SessionService
    participant LoginScreen
    participant ApiService
    participant Backend as Backend API
    participant AppShell
    participant HomeScreen

    User->>MyApp: Launch app
    MyApp->>SessionService: isLoggedIn()
    SessionService-->>MyApp: token present?
    MyApp->>SessionService: loadThemeMode()
    SessionService-->>MyApp: ThemeMode

    alt Logged in
      MyApp->>AppShell: build logged-in shell
      AppShell->>SessionService: currentUserId()
      SessionService-->>AppShell: current user id
      AppShell->>HomeScreen: show default tab
    else Not logged in
      MyApp->>LoginScreen: build login screen
      User->>LoginScreen: Enter email/password
      LoginScreen->>ApiService: login(email, password)
      ApiService->>Backend: POST /login
      Backend-->>ApiService: accessToken
      ApiService->>SessionService: saveToken(token)
      ApiService->>SessionService: saveLoginEmail(email)
      ApiService->>Backend: GET /getAllUsers
      Backend-->>ApiService: user list
      ApiService->>SessionService: saveResolvedUserId(userId)
      ApiService-->>LoginScreen: { success: true }
      LoginScreen-->>MyApp: onLoginSuccess()
      MyApp->>AppShell: rebuild logged-in shell
      AppShell->>SessionService: currentUserId()
      SessionService-->>AppShell: current user id
      AppShell->>HomeScreen: show default tab
    end
```

## Notes

- The app uses `MyApp` as the stateful root that decides between `LoginScreen` and `AppShell`.
- `SessionService` is the local persistence layer for token, resolved user id, login email, and theme mode.
- `ApiService` is a static service layer that talks directly to the backend and maps responses into app models.
- `AppShell` is the navigation hub for the authenticated experience.
