steps = [
    [
        # "Up" SQL statement
        # Signup and Login
        # id, first_name, username, password, confirm_password, unique_email
        """
        CREATE TABLE IF NOT EXISTS authentication (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(30),
            username VARCHAR(150) UNIQUE,
            hashed_password VARCHAR(128),
            email VARCHAR(254) UNIQUE NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE authentication;
        """
        """
        GRANT ALL ON DATABASE mydb TO admin;
        """,
    ],
    [
        # "Up" SQL statement
        # start_date, end_date, time, expense, expense_date, category
        """
        CREATE TABLE IF NOT EXISTS trips (
            trip_id SERIAL PRIMARY KEY NOT NULL,
            trip_name VARCHAR(100) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            auth_id INTEGER REFERENCES authentication(id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE trips;
        """,
    ],
    [
        # "Up" SQL statement
        #
        """
        CREATE TABLE IF NOT EXISTS itinerary (
            location_id SERIAL PRIMARY KEY NOT NULL,
            location_name VARCHAR(100) NOT NULL,
            visit_date DATE NOT NULL,
            start_time TIME NOT NULL,
            trip_id INTEGER REFERENCES trips(trip_id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE itinerary;
        """,
    ],
    [
        # "Up" SQL statement
        #
        """
        CREATE TABLE IF NOT EXISTS budget (
            expense_id SERIAL PRIMARY KEY NOT NULL,
            expense_name VARCHAR(100) NOT NULL,
            cost FLOAT NOT NULL,
            category VARCHAR(100) NOT NULL,
            total FLOAT DEFAULT 0.00,
            trip_id INTEGER REFERENCES trips(trip_id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE budget;
        """,
    ],
]
