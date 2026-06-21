# Dataset Examples for Resume Keyword Extraction

For a Final Year Project, using a standardized dataset is crucial for evaluation. The most common source for these is **Kaggle**.

## 1. Popular Kaggle Datasets
Here are the top datasets you can use:
*   **[Resume Entities for NER](https://www.kaggle.com/datasets/dataturks/resume-entities-for-ner)**: 220 resumes labeled with entities like Name, Designation, Colleges, Skills, etc.
*   **[Resume Dataset (Categorized)](https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset)**: 2400+ resumes categorized by job role (Data Science, HR, etc.).
*   **[HuggingFace Resume NER](https://huggingface.co/datasets/re-search/resume_ner)**: A larger dataset often mirrored on Kaggle for complex model training.

---

## 2. Dataset Formats (What you will actually see)

### A. Raw Resume Text (For Extraction Testing)
This is what your `nlp_engine.py` currently processes.
```text
JOHN DOE
Software Engineer | Python Developer
Email: john.doe@email.com | Phone: +234 801 234 5678

PROFESSIONAL SUMMARY
Highly motivated Software Engineer with 3+ years of experience in backend development.

SKILLS
Python, FastAPI, Docker, PostgreSQL, React, AWS.

EXPERIENCE
Software Engineer at Prembly (2022 - Present)
- Developing identity verification APIs using FastAPI and Python.
```

### B. Annotated JSON (For Training/Evaluation)
If you decide to **fine-tune** your model, you need data in "Entity" format.
```json
{
  "content": "JOHN DOE\nSoftware Engineer | Python Developer...",
  "annotation": [
    {"label": ["NAME"], "points": [{"start": 0, "end": 8, "text": "JOHN DOE"}]},
    {"label": ["DESIGNATION"], "points": [{"start": 9, "end": 26, "text": "Software Engineer"}]},
    {"label": ["SKILLS"], "points": [{"start": 105, "end": 111, "text": "Python"}]}
  ]
}
```

### C. Evaluation CSV (For Chapter 4 Results)
You can create a small CSV to track how well your system performs.
| Resume ID | Expected Skills | Extracted Skills | Match % |
|-----------|-----------------|------------------|---------|
| 001       | Python, Java    | Python, Java     | 100%    |
| 002       | Docker, AWS     | Docker           | 50%     |

---

## 3. How to use them in your Project?
1.  **Download** a dataset from Kaggle.
2.  **Upload** 10-20 resumes to your system.
3.  **Compare** the system's output with the Kaggle annotations.
4.  **Record** the results in your Chapter 4.
