# GuideMe - Comprehensive Trip Planning Web Application
- Anastasia Dwarica-Pham
- Austin aka Andrew Sahagun
- Matthew Rauschenberg
- Priyanka Kannan


## Functionality


GuideMe is a comprehensive trip-planning web application designed to help users organize and plan their journeys effectively. It provides tools for itinerary


creation, budget management, and exploration through interactive maps. Users can create an account to access enhanced features and personalized trip planning.


### Account Management API
GuideMe's backend API, built with FastAPI, provides the following functionality for user account management:


- Create Account: Users can register a new account by providing their first name, username, email, and password. The password is securely hashed before being stored in the database.


- Get Account: Users can retrieve their account information by providing their username. This information includes the user's unique ID, first name, username, email, and hashed password.


- Get Token: This endpoint allows users to obtain an access token, which is required for authenticated access to certain features. It returns an access token in a Bearer token format and the user's account information.


- Protected Endpoint: Users with a valid access token can access protected endpoints, which can be used for secure and authenticated operations.


### Trip Management API
GuideMe offers trip management features through the following API endpoints:


- Create Trip: Users can create a new trip itinerary, specifying a trip name, start date, and end date.


- Update Trip: Users can update an existing trip by modifying its name, start date, and end date.


- Get Trip: Users can retrieve information about a specific trip using its unique trip ID.


- Get All Trips: Users can retrieve a list of all their trips, sorted by start date.


- Delete Trip: Users can delete a trip, removing it from their trip list.


- Get Trip Budget: Retrieve a list of expenses associated with a specific trip. Users can view all expenses related to a particular trip, including their IDs, names, costs, categories, and the total budget for that trip.


### Budget Management API
GuideMe's budget management API, built using FastAPI, offers several features for managing trip expenses and budgets:


- Create Expense: Users can add expenses associated with a specific trip. The API endpoint allows users to create an expense by specifying the expense name, cost, and category. The cost is stored as a decimal for accurate financial tracking.


- Update Expense: This endpoint enables users to modify the details of an existing expense by providing the expense ID. Users can update the expense name, cost, and category.


- Get Expense: Users can retrieve details of a specific expense by providing its unique ID. The response includes the expense ID, name, cost, and category.


- Get All Expenses: This endpoint retrieves a list of all expenses, including their IDs, names, costs, and categories.


- Delete Expense: Users can remove an expense by specifying its unique ID. This feature is essential for expense management and maintaining accurate trip budgets.


- Update Total Budget: Users can update the total budget for a specific trip. This API endpoint allows users to modify the total budget amount.


### Itinerary Management API
GuideMe's Itinerary management API, built with FastAPI, offers features for managing trip locations and schedules:


- Create Location: Users can add locations to their trip's itinerary. The API allows users to specify the location name, visit date, and start time. The location information is associated with a specific trip.

- Update Location: This endpoint enables users to modify the details of an existing location within the itinerary. Users can update the location name, visit date, and start time.


- Get Location: Users can retrieve details of a specific location in the itinerary by providing its unique location ID. The response includes the location ID, name, visit date, and start time.


- Get All Locations: This endpoint retrieves a list of all locations in the itinerary, sorted by visit date and start time. The response includes location IDs, names, visit dates, and start times.


- Delete Location: Users can remove a location from the itinerary by specifying its unique location ID. This feature is essential for managing and updating the trip's schedule.


- Get Trip Itinerary: Retrieve a list of locations associated with a specific trip. Users can view all locations in a particular trip's itinerary, including their IDs, names, visit dates, start times, and the trip ID to which they belong.


## User Stories/Scenarios


Scenario: User Account Management
Given a user wants to use GuideMe
When they register a new account by providing their first name, username, email, and password
Then their account is created, and the password is securely hashed


Given a registered user
When they provide their username
Then they can retrieve their account information, including their ID, first name, username, email, and hashed password


Given a registered user
When they request an access token
Then they receive an access token in Bearer token format and their account information
Given a user with a valid access token
When they access protected endpoints
Then they can perform secure and authenticated operations


Scenario: Trip Management
Given a user wants to plan a trip
When they specify a trip name, start date, and end date
Then they can create a new trip itinerary


Given a user has an existing trip
When they modify the trip's name, start date, and end date
Then the trip details are updated


Given a user has one or more trips
When they provide a unique trip ID
Then they can retrieve information about that specific trip


Given a user has one or more trips
When they request a list of all their trips
Then they receive a list of trips sorted by start date


Given a user has an existing trip
When they choose to delete the trip
Then the trip is removed from their trip list


Given a user has an existing trip
When they request the trip budget
Then they receive a list of expenses related to the trip, including IDs, names, costs, categories, and the total budget



## Stretch Goals

- History - Page of Past Completed Trips
- User Profile Page - Personal Information Management
- Currency Converter
- Live Update - Link to Cost and Budget Management
- Collaborate with Other Travel Buddies
- Transportation Booking Integration
- Local Transportation Options and Booking Services
- Trip Selection on a Map - Map Box API Integration

## Onboarding
- We decided ahead of time we would not push changes to the main without someone else approving it.
- Whenever a team member would start on a new aspect of the project they would branch off to keep the current branch working.
- We would often do mob coding via the live share feature in VS code



## Tech Stack
- Backend: FastAPI
- Frontend:React
- DB: PostgresSQL
- Docker

## Journaling
- Created a journal folder where we update entries on the first and last school day of the week.

## Documentation for API
- Notion: https://nenam.notion.site/API-Design-7320f9cbde894c02a6751cfa57a09bf2
- Wireframe: https://excalidraw.com/#room=0a97c68042502c4318d8,rU76PcLpfZTKmBqrdLwu6w


## Testing
- test_get_all_trips : This test retrieves a list of all trips. - Priyanka
- test_get_account: This test retrieves the username of the account - Matthew
- test_get_one_trip: This test retrieves one trip - Anastasia
- test_update_trip: This test updates one trip - Austin


## Issue Tracking
- Notion: https://nenam.notion.site/Workload-17ab495124f243378f0052395aa0b61f
