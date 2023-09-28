steps = [
    [
        # "Up" SQL statement
        # id, first_name, last_name, username, password, confirm_password, email
        """
        CREATE TABLE authentication (
            id SERIAL PRIMARY KEY NOT NULL,
            required_limited_text VARCHAR(1000) NOT NULL,
            required_unlimited_text TEXT NOT NULL,
            required_date_time TIMESTAMP NOT NULL,
            automatically_set_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            required_integer INTEGER NOT NULL,
            required_money MONEY NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE dummy;
        """
    ],
    [
        # "Up" SQL statement
        # start_date, end_date, time, expense, expense_date, category
        """
        CREATE TABLE trips (
            id SERIAL PRIMARY KEY NOT NULL,
            required_limited_text VARCHAR(1000) NOT NULL,
            required_unlimited_text TEXT NOT NULL,
            required_date_time TIMESTAMP NOT NULL,
            automatically_set_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            required_integer INTEGER NOT NULL,
            required_money MONEY NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE big_dummy;
        """
    ]
]
