from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import model

app = FastAPI(title="EquityIQ ML Service")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/predict/{ticker}")
def predict(ticker: str):
    try:
        predictions = model.predict_trend(ticker)
        return {
            "ticker": ticker.upper(),
            "status": "success",
            "predictions": predictions
        }
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}
