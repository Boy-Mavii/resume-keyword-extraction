import json
from nlp_engine import process_resume

def evaluate_system(dataset_path, limit=10):
    results = []
    
    with open(dataset_path, 'r') as f:
        lines = f.readlines()
        
    print(f"Starting evaluation on {min(limit, len(lines))} samples...\n")
    
    for i, line in enumerate(lines[:limit]):
        data = json.loads(line)
        text = data['content']
        annotations = data['annotation']
        
        # Ground Truth
        truth = {
            "name": "",
            "skills": set(),
            "designation": set(),
            "companies": set(),
            "email": ""
        }
        
        for ann in annotations:
            label = ann['label'][0]
            val = ann['points'][0]['text'].strip()
            
            if label == "Name":
                truth["name"] = val
            elif label == "Skills":
                # Skills often come as a long block in this dataset
                # We'll split by commas and common separators
                found_skills = [s.strip().lower() for s in val.replace('\n', ',').split(',') if s.strip()]
                truth["skills"].update(found_skills)
            elif label == "Designation":
                truth["designation"].add(val.lower())
            elif label == "Companies worked at":
                truth["companies"].add(val.lower())
            elif label == "Email Address":
                truth["email"] = val

        # System Output
        prediction = process_resume(text)
        
        print(f"\n--- RAW TEXT FOR SAMPLE {i+1} ---\n")
        print(text)
        
        print(f"\n--- PREDICTION FOR SAMPLE {i+1} ---\n")
        print(json.dumps(prediction, indent=2))
        
        # Calculate Metrics for Skills (Simple Intersection)
        pred_skills = set([s.lower() for s in prediction['skills']])
        # Since truth skills might be noisy, we check how many of our extracted skills are in the truth block
        # Or better: how many keywords extracted are relevant
        
        # For a simple demo, let's track hit rates
        name_match = truth["name"].lower() in prediction["name"].lower() or prediction["name"].lower() in truth["name"].lower()
        
        # Skill Precision: How many of our predicted skills are in the truth set?
        # (This is tricky because our SKILLS_DB is structured, truth is free-text)
        skill_hits = [s for s in pred_skills if any(ts in s or s in ts for ts in truth["skills"])]
        skill_precision = len(skill_hits) / len(pred_skills) if pred_skills else 0
        
        results.append({
            "sample": i + 1,
            "name_match": name_match,
            "skill_precision": round(skill_precision, 2),
            "skills_found": list(pred_skills)[:5]
        })
        
        print(f"Sample {i+1}: Name Match: {name_match} | Skill Precision: {round(skill_precision, 2)}")

    # Summary
    avg_skill_prec = sum(r['skill_precision'] for r in results) / len(results)
    name_accuracy = sum(1 for r in results if r['name_match']) / len(results)
    
    print("\n--- FINAL EVALUATION SUMMARY ---")
    print(f"Total Samples: {len(results)}")
    print(f"Name Extraction Accuracy: {name_accuracy * 100}%")
    print(f"Average Skill Precision: {avg_skill_prec * 100}%")
    print("--------------------------------")

if __name__ == "__main__":
    evaluate_system("test_dataset.json")
