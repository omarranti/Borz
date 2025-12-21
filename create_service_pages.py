#!/usr/bin/env python3
"""Script to generate service pages from template"""
import os

# Service page configurations
services = [
    {
        "filename": "exterior-detailing-dubai.html",
        "title": "Exterior Detailing Dubai - Showroom-Quality Paint Enhancement & Protection",
        "h1": "Exterior Detailing <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Exterior Detailing",
        "whatsapp_text": "Exterior%20Detailing",
        "description": "Professional exterior detailing in Dubai. Paint correction, polishing, and protection for luxury cars in Al Quoz. Remove swirls, restore paint clarity, and protect your vehicle from Dubai's harsh desert conditions.",
        "keywords": "exterior detailing Dubai, car exterior detailing Al Quoz, paint correction Dubai, car polishing Dubai, exterior car wash Dubai, paint enhancement Dubai, luxury car detailing Dubai",
        "image_before": "polish-before",
        "image_after": "polish-after",
    },
    {
        "filename": "paint-correction-dubai.html",
        "title": "Paint Correction Dubai - Professional Swirl & Scratch Removal",
        "h1": "Paint Correction <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Paint Correction",
        "whatsapp_text": "Paint%20Correction",
        "description": "Professional paint correction in Dubai. Remove swirl marks, scratches, and paint defects. Restore your vehicle's paint to showroom condition with multi-stage polishing and correction techniques.",
        "keywords": "paint correction Dubai, paint correction Al Quoz, swirl mark removal Dubai, scratch removal Dubai, paint polishing Dubai, paint enhancement Dubai, luxury car paint correction UAE",
        "image_before": "polish-before",
        "image_after": "polish-after",
    },
    {
        "filename": "window-tinting-dubai.html",
        "title": "Window Tinting Dubai - Premium Car Window Film Installation",
        "h1": "Window Tinting <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Window Tinting",
        "whatsapp_text": "Window%20Tinting",
        "description": "Professional window tinting in Dubai. Premium heat rejection film, UV protection, and RTA-compliant installation. Reduce cabin temperature by 15-20°C and protect your interior from Dubai's intense sun.",
        "keywords": "window tinting Dubai, car window tinting Al Quoz, car tint Dubai, window film Dubai, luxury car tinting UAE, ceramic window tint Dubai, best window tinting Dubai",
        "image_before": "tint-before",
        "image_after": "tint-after",
    },
    {
        "filename": "full-detailing-dubai.html",
        "title": "Full Detailing Dubai - Complete Interior & Exterior Car Detailing Service",
        "h1": "Full Detailing <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Full Detailing",
        "whatsapp_text": "Full%20Detailing",
        "description": "Complete car detailing in Dubai. Comprehensive interior and exterior cleaning, paint correction, and protection. One-stop service for showroom-quality results in Al Quoz.",
        "keywords": "full detailing Dubai, complete car detailing Dubai, full car detail Al Quoz, comprehensive car detailing UAE, luxury car detailing Dubai, premium car detailing Dubai",
        "image_before": "interior-before",
        "image_after": "interior-after",
    },
    {
        "filename": "paint-protection-dubai.html",
        "title": "Paint Protection Dubai - Complete Guide to Protecting Your Car's Paint",
        "h1": "Paint Protection <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Paint Protection",
        "whatsapp_text": "Paint%20Protection",
        "description": "Complete paint protection solutions in Dubai. Compare PPF vs ceramic coating, choose the best protection for your vehicle, and shield your paint from Dubai's harsh desert conditions.",
        "keywords": "paint protection Dubai, car paint protection Al Quoz, paint protection film Dubai, paint sealant Dubai, vehicle paint protection UAE, best paint protection Dubai",
        "image_before": "ppf-before",
        "image_after": "ppf-after",
    },
    {
        "filename": "engine-bay-detailing-dubai.html",
        "title": "Engine Bay Detailing Dubai - Professional Engine Compartment Cleaning",
        "h1": "Engine Bay Detailing <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Engine Bay Detailing",
        "whatsapp_text": "Engine%20Bay%20Detailing",
        "description": "Professional engine bay detailing in Dubai. Deep cleaning, degreasing, and protection for your engine compartment. Restore your engine bay to showroom condition in Al Quoz.",
        "keywords": "engine bay detailing Dubai, engine cleaning Dubai, engine bay cleaning Al Quoz, engine detailing Dubai, engine compartment cleaning UAE, luxury car engine detailing",
        "image_before": "interior-before",
        "image_after": "interior-after",
    },
    {
        "filename": "headlight-restoration-dubai.html",
        "title": "Headlight Restoration Dubai - Professional Headlight Cleaning & Restoration",
        "h1": "Headlight Restoration <span class=\"text-borz-gold\">Dubai</span>",
        "service_name": "Headlight Restoration",
        "whatsapp_text": "Headlight%20Restoration",
        "description": "Professional headlight restoration in Dubai. Remove yellowing, fogging, and oxidation. Restore clarity and improve visibility with our premium headlight restoration service in Al Quoz.",
        "keywords": "headlight restoration Dubai, headlight polishing Dubai, foggy headlight repair Al Quoz, headlight restoration UAE, yellow headlight restoration Dubai, headlight cleaning Dubai",
        "image_before": "polish-before",
        "image_after": "polish-after",
    },
]

print(f"Generated {len(services)} service page configurations")
for s in services:
    print(f"  - {s['filename']}")
