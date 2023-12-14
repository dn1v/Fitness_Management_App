# Fitness Management App

A minimalistic fitness management application catering to athletes and coaches, providing profile management, secure authentication, interactive connection handling, and precise subjective load monitoring through wellness questionnaires. This app integrates sRPE and POMS methodologies to ensure effective training management and mood state evaluation.

## Key Features

### Athletes & Coaches:

-   **Profile Management:** Create, update, and delete profiles.
-   **Authentication & Sessions:** Login, logout, and manage sessions.
-   **Profile Photo Handling:** Upload, view, and delete profile photos.
-   **Connection Management:** Send, receive, and handle connection requests.
-   **Interactions Handling:** Accept or decline connections.
-   **Error Management:** Manages various exceptions and errors.

### Wellness Questionaire & Subjective load monitoring:

-   **sRPE (session rating of perceived exertion):** Method used to assess an individual's subjective rating of the intensity of physical activity or exercise. It is commonly used in sports science and exercise physiology research to help monitor and prescribe training loads. sRPE is used to help users monitor their training intensity and make adjustments as needed.

-   **POMS (Profile of Mood States):** The POMS questionnaire is commonly used in research studies and clinical settings to measure changes in mood over time, assess the effectiveness of interventions, and help diagnose mood disorders such as depression or anxiety. Because of the psycho-physiological aspects of stress, it is often used to indirectly monitor physiological responses and adaptations over time and help avoid maladaptations or overtraining in athletes.

## Requirements

-   Node.js version 16.0.0 or later
-   MongoDB version 4.0.0 or later

## Installation

1. Clone the repository to your local machine:

```bash
git clone <repository URL>
```

2. Install the required dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
PORT=<port number>
MONGODB_URL=<MongoDB connection string>
JWT_SECRET=<secret key for JSON Web Token>
CORS_URL=<your frontend URL>

```

4. Start the application:

```bash
nodemon exec
```

## Usage

Once the application is running, you can access it by navigating to http://localhost: <_port-number_> in your web browser.

## TODO

-   **Quality Assurance Testing (Automated):** Ensure comprehensive testing through both manual and automated processes to maintain product quality.
-   **Real-time Chat Integration:** Integrate real-time chat functionality to enhance user interactions and engagement.
-   **Coach Posts Implementation:** Implement a feature allowing coaches to create and share posts for athlete engagement and guidance.
-   **Training Group Management:** Create functionality to efficiently manage and organize training groups for better coordination and communication.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)