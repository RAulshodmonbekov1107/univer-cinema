#!/bin/bash

# Function to handle SIGINT (Ctrl+C)
function cleanup {
    echo "Stopping development servers..."
    # Kill background processes
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Trap SIGINT
trap cleanup SIGINT

# Define colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Django backend folder exists
if [ ! -d "backend" ]; then
    echo "Error: 'backend' directory not found"
    exit 1
fi

# Check if React frontend folder exists
if [ ! -d "frontend" ]; then
    echo "Error: 'frontend' directory not found"
    exit 1
fi

echo -e "${GREEN}Starting Univer Cinema development servers...${NC}"

# Start Django backend
echo -e "${BLUE}Starting Django backend...${NC}"
cd backend
source venv/bin/activate
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Start React frontend
echo -e "${BLUE}Starting React frontend...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}Development servers started!${NC}"
echo -e "${GREEN}Backend running at http://localhost:8000${NC}"
echo -e "${GREEN}Frontend running at http://localhost:3000${NC}"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes to finish
wait $FRONTEND_PID $BACKEND_PID 