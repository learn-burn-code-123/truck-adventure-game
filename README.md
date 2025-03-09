# Truck Adventure Game 🚛

A fun and educational web-based game designed for 4-5 year old children. Drive a truck, collect stars, and avoid obstacles!

## Features
- Simple touch controls perfect for young children
- Large, colorful buttons and visuals
- Educational elements:
  - Color recognition
  - Hand-eye coordination
  - Basic counting (star collection)
  - Spatial awareness
- Mobile-friendly design for iPhone
- No ads or in-app purchases
- Safe and child-friendly

## Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the game
python src/app.py
```

## How to Play
1. Tap 'Start Game' to begin
2. Use the left and right arrows to move the truck
3. Collect golden stars to increase your score
4. Avoid brown obstacles
5. Try to get as many stars as you can!

## Development
The game is built with:
- Flask (Python web framework)
- HTML5 Canvas for game graphics
- Mobile-friendly touch controls
- Responsive design for different screen sizes

## Directory Structure
```
truck-adventure-game/
├── README.md
├── requirements.txt
├── src/
│   └── app.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── game.js
│   └── images/
└── templates/
    └── index.html
```
