import spacy
from spacy.matcher import PhraseMatcher
import re
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import os
    os.system("python3 -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

SKILLS_DB = [
    # Programming Languages
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby",
    # Frameworks & Libraries
    "React", "Next.js", "Node.js", "FastAPI", "Django", "Flask", "NestJS", "Express.js", "Rails", "Laravel", "Spring Boot",
    "jQuery", "Vue.js", "Angular", "Tailwind CSS", "Bootstrap", "Redux", "Pandas", "NumPy", "Scikit-Learn",
    "TensorFlow", "PyTorch", "HuggingFace", "NLTK", "SpaCy", "Selenium", "Cypress", "Jest",
    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Cassandra", "Elasticsearch", "Firebase",
    # Cloud & DevOps
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Google Cloud", "Jenkins", "Git", "GitHub", "GitLab", "Terraform",
    "Ansible", "CI/CD", "CircleCI", "Travis CI", "Lambda", "SQS", "SNS", "S3", "EC2",
    # Other Skills
    "Machine Learning", "Data Analysis", "Project Management", "Agile", "Scrum", "REST API", "GraphQL", "Microservices",
    "Serverless", "Asynchronous Processing", "NLP", "Deep Learning", "HTML", "CSS", "RabbitMQ", "Kafka", "Redis",
    # Graphic Design & UI/UX
    "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "Figma", "Canva", "After Effects", "Premiere Pro",
    "Video Editing", "Graphic Design", "UI/UX Design", "CorelDraw",
    # Additional Tech & Frameworks found in samples
    "ASP.NET", "Microsoft SQL Server", "ERP", "SAP Business ByDesign", "Nextjs", "Nodejs", "Reactjs", "Primera"
]

# Words that indicate an entity is NOT likely a company/org in this context
INVALID_ORG_KEYWORDS = {
    "lagos", "nigeria", "state", "city", "street", "road", "avenue", 
    "computer", "science", "software", "engineering", "bachelor", "master", 
    "degree", "diploma", "university", "college", "school", "curriculum",
    "summary", "email", "phone", "mobile", "address", "location", "present",
    "education", "experience", "skills", "projects", "certifications", "languages",
    "interests", "technical", "professional", "core", "frontend", "backend",
    "full-stack", "senior", "junior", "intern", "developer", "engineer",
    "api", "rest", "graphql", "oauth", "jwt", "sdk", "ui", "ux", "css", "html",
    "node.js", "next.js", "react.js", "vue.js", "databases", "caching", "devops", 
    "cloud", "fintech", "regulated", "systems", "deployed", "building", "using",
    "record", "track", "proven", "strong", "expertise", "highly", "motivated",
    "about", "me", "profile", "contact", "summary", "objective", "career",
    "adobe", "creative", "suite", "canva", "figma", "indesign", "photoshop", 
    "illustrator", "video", "personnel", "boutique", "estate", "design", "graphic",
    "scholarship", "recipient", "nanodegree", "diploma", "training", "workshop"
}

# Known legitimate companies/organizations (can be expanded)
KNOWN_COMPANIES = {
    "google", "microsoft", "amazon", "apple", "meta", "facebook", "netflix",
    "uber", "airbnb", "stripe", "shopify", "salesforce", "oracle", "ibm",
    "prembly", "identitypass", "altschool", "zeronspace", "moniass", "malead",
    "clippapay", "kampusbox", "niit", "paystack", "flutterwave", "indicina", "interswitch"
}

def extract_contact_info(text):
    # Improved Regex for email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    email = re.findall(email_pattern, text)
    
    # Improved Regex for phone (handles +234, spaces, and various formats)
    phone_pattern = r'(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}'
    phone = re.findall(phone_pattern, text)
    # Clean up phone numbers (remove duplicates and short fragments)
    phone = [p.strip() for p in phone if len(re.sub(r'\D', '', p)) >= 8]
    
    return {
        "email": email[0] if email else "Not found",
        "phone": phone[0] if phone else "Not found"
    }

def extract_name(text):
    # Clean text first
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if not lines:
        return "Not found"
        
    # Heuristic 1: Names are usually at the very top, 2-3 capitalized words
    for line in lines[:5]:
        # Filter out lines with emails or phones
        if "@" in line or any(char.isdigit() for char in line):
            continue
        # Check if line is mostly alphabetic and capitalized
        words = line.split()
        if 2 <= len(words) <= 4:
            if all(w[0].isupper() for w in words if w[0].isalpha()):
                return line
                
    # Heuristic 2: spaCy PERSON NER
    doc = nlp(text[:800])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Sanity check: must be at least two words
            if len(ent.text.split()) >= 2:
                return ent.text.strip()
                
    return lines[0] if lines else "Not found"

def extract_entities(text):
    import difflib
    doc = nlp(text)
    entities = {
        "ORG": [],
        "GPE": [], # Locations
        "DATE": [], # Dates
    }
    skills_lower = set([s.lower() for s in SKILLS_DB])
    org_candidates = {}

    for ent in doc.ents:
        if ent.label_ == "ORG":
            text_val = ent.text.strip().replace("\n", " ")
            text_lower = text_val.lower()
            
            # Basic filters
            if len(text_val) < 3 or len(text_val) > 100:
                continue
            if text_lower in skills_lower:
                continue
            
            words = text_lower.split()
            # Stricter filtering: reject if ANY word is in invalid keywords
            if any(w in INVALID_ORG_KEYWORDS for w in words):
                continue
            
            # Reject if it's mostly symbols/numbers
            if not any(c.isalpha() for c in text_val):
                continue
            
            # Calculate confidence score
            confidence = 0.5  # Base confidence
            
            # Boost if in known companies
            if any(known in text_lower for known in KNOWN_COMPANIES):
                confidence += 0.3
            
            # Boost if contains common company suffixes
            company_suffixes = ["inc", "ltd", "limited", "corp", "corporation", "llc", "technologies", "technology"]
            if any(suffix in text_lower for suffix in company_suffixes):
                confidence += 0.2
            
            # Penalize if too short
            if len(text_val) < 5:
                confidence -= 0.2
            
            # Penalize if all caps (likely acronym confusion)
            if text_val.isupper() and len(text_val) < 6:
                confidence -= 0.3
            
            org_candidates[text_val] = max(0.0, min(1.0, confidence))
            
        elif ent.label_ == "GPE":
            text_val = ent.text.strip().replace("\n", " ")
            text_lower = text_val.lower()
            # Filter technologies out of locations
            if text_lower in skills_lower or any(w in INVALID_ORG_KEYWORDS for w in text_lower.split()):
                continue
            if len(text_val) > 2 and text_val not in entities["GPE"]:
                entities["GPE"].append(text_val)
        elif ent.label_ == "DATE":
            text_val = ent.text.strip().replace("\n", " ")
            # Filter out strings that are likely not dates (e.g. phone fragments or short numbers)
            digits_only = re.sub(r'\D', '', text_val)
            if len(digits_only) > 0 and len(digits_only) < 4:
                continue
            if text_val.isdigit() and not (1900 <= int(text_val) <= 2100):
                continue
            # Filter out things that look like part of a phone number (e.g. 146 1447)
            if re.match(r'^\d{3,4}[\s-]\d{3,4}$', text_val):
                continue
            # Basic duration vs date check
            if any(word in text_val.lower() for word in ["year", "month", "present", "current"]):
                # It's likely a duration or relative date
                pass 
            if text_val not in entities["DATE"]:
                entities["DATE"].append(text_val)

    # Fuzzy deduplication and filter by confidence threshold
    filtered_orgs = []
    for org, confidence in sorted(org_candidates.items(), key=lambda x: x[1], reverse=True):
        # Only keep orgs with confidence >= 0.4
        if confidence < 0.4:
            continue
        
        # Fuzzy match to remove near-duplicates
        if not any(difflib.SequenceMatcher(None, org.lower(), o["name"].lower()).ratio() > 0.85 for o in filtered_orgs):
            # Remove if it's a location
            if org not in entities["GPE"]:
                filtered_orgs.append({"name": org, "confidence": round(confidence, 2)})

    entities["ORG"] = filtered_orgs
    return entities

def extract_skills(text):
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    patterns = [nlp.make_doc(skill) for skill in SKILLS_DB]
    matcher.add("SKILLS", patterns)
    
    doc = nlp(text)
    matches = matcher(doc)
    
    found_skills = {}
    for match_id, start, end in matches:
        skill = doc[start:end].text
        skill_lower = skill.lower()
        if skill_lower not in found_skills:
            db_version = next((s for s in SKILLS_DB if s.lower() == skill_lower), skill)
            found_skills[skill_lower] = db_version
    
    return sorted(list(found_skills.values()))

def process_resume(text):
    # Pre-clean text to ensure tokens are separated
    # Some PDF extractors mash words together. This is a basic attempt to fix common mashups.
    # (Though it's hard to do perfectly without a dictionary)
    
    contact = extract_contact_info(text)
    name = extract_name(text)
    entities = extract_entities(text)
    skills = extract_skills(text)
    
    # Improved keyword extraction
    doc = nlp(text)
    keywords = []
    skill_names_lower = [s.lower() for s in skills]
    name_words = set(name.lower().split())
    date_texts_lower = set([d.lower() for d in entities["DATE"]])
    
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip().replace("\n", " ")
        chunk_lower = chunk_text.lower()
        
        # Filter filters filters
        if len(chunk_text) < 5: continue # Longer keywords for better quality
        if any(w in name_words for w in chunk_lower.split()): continue
        if chunk_lower in skill_names_lower: continue
        if any(w in INVALID_ORG_KEYWORDS for w in chunk_lower.split()): continue
        if any(chunk_lower in dt or dt in chunk_lower for dt in date_texts_lower): continue
        
        # Avoid generic "resume filler" words and common headers
        if any(filler in chunk_lower for filler in ["track record", "building", "proven", "highly motivated", "career objective", "creative and detail-oriented"]):
            continue
            
        if chunk_text not in keywords:
            keywords.append(chunk_text)
            
    return {
        "name": name,
        "contact": contact,
        "entities": entities,
        "skills": skills,
        "keywords": keywords[:12]
    }


