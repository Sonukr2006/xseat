from fastapi import FastAPI, Query
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

app = FastAPI(title="XSEAT Prediction Service", version="1.0.0")

class PredictionResponse(BaseModel):
    probability: float
    predicted_status: str


def _train_models():
    rng = np.random.default_rng(42)
    samples = 800
    waitlist = rng.integers(1, 80, size=samples)
    days = rng.integers(1, 30, size=samples)
    train_factor = rng.uniform(0.8, 1.2, size=samples)
    X = np.column_stack([waitlist, days, train_factor])
    y = (waitlist < (40 - days * 0.5)) | (train_factor > 1.05)
    y = y.astype(int)

    lr = LogisticRegression(max_iter=200)
    rf = RandomForestClassifier(n_estimators=120, random_state=42)
    lr.fit(X, y)
    rf.fit(X, y)
    return lr, rf


_lr, _rf = _train_models()


def _predict_probability(current_waitlist: int, days_to_departure: int, train_factor: float) -> float:
    X = np.array([[current_waitlist, days_to_departure, train_factor]])
    proba_lr = _lr.predict_proba(X)[0][1]
    proba_rf = _rf.predict_proba(X)[0][1]
    return float((proba_lr + proba_rf) / 2)


def _status(probability: float) -> str:
    if probability >= 0.7:
        return "CNF"
    if probability >= 0.4:
        return "RAC"
    return "WL"


@app.get("/prediction/waitlist", response_model=PredictionResponse)
async def waitlist_prediction(
    train_number: str = Query(...),
    travel_date: str = Query(...),
    current_waitlist: int = Query(..., alias="current_waitlist"),
):
    del train_number
    del travel_date
    days_to_departure = max(1, min(30, 10))
    train_factor = 1.0
    probability = _predict_probability(current_waitlist, days_to_departure, train_factor)
    return PredictionResponse(probability=round(probability, 3), predicted_status=_status(probability))


@app.get("/")
async def health():
    return {"status": "ok", "service": "xseat-prediction"}
