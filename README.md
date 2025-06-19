# BetWise Frontend

This is the React-based frontend for the BetWise sports betting platform. It communicates with the BetWise backend to provide a seamless user experience.

## Features

- User authentication (Login, Register, Social Logins)
- Wallet management (View balance, transactions, deposit, withdraw)
- Game listings and personalized feeds
- Single and multi-bet placement via a dynamic Bet Slip
- AI-powered chat and responsible gambling feedback
- Comprehensive Admin Dashboard for platform management

## Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: TailwindCSS
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running instance of the [BetWise Backend](<link-to-your-backend-repo>)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-frontend-repo-url>
    cd betwise-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    - Create a `.env` file in the root directory.
    - Add the base URL of your running backend instance:
      ```
      VITE_API_BASE_URL=http://localhost:5000/api/v1
      ```

### Running the Development Server

```bash
npm run dev