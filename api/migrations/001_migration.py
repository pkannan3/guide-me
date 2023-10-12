steps = [
    [
        # "Up" SQL statement
        # Signup and Login
        # id, first_name, username, password, confirm_password, unique_email
        """
        CREATE TABLE authentication (
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
        """
    ],
    [
        # "Up" SQL statement
        # start_date, end_date, time, expense, expense_date, category
        """
        CREATE TABLE trips (
            trip_id SERIAL PRIMARY KEY NOT NULL,
            trip_name VARCHAR(100) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE trips;
        """
    ]
]
