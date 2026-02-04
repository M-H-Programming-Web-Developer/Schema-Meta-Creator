
import { GoogleGenAI } from "@google/genai";
import { ServiceType, PageType } from "../types";

export const generateSeoContent = async (
  service: ServiceType,
  city: string,
  businessName: string,
  pageType: PageType,
  relatedServices: string[] = []
): Promise<{ description: string; title: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const relatedText = relatedServices.length > 0 
    ? `Mentioning these related services: ${relatedServices.join(', ')}` 
    : '';

  const prompt = `
    As an expert SEO specialist, generate a Meta Title and Meta Description for a local ${service} business page.
    Business Name: "${businessName}" (DO NOT add the city name into this string)
    City: ${city}
    Page Type: ${pageType}
    ${relatedText}
    
    CRITICAL SEO RULES:
    1. DO NOT use the word "Home" in the title or description for Home pages.
    2. DO NOT add markers like "(Home)" or similar labels.
    3. The title should focus on the Service and City.
    4. Business Name should be present in the title but NOT modified to include the city (e.g., if business is "Almo", keep it "Almo", don't change to "Almo Houston").
    
    Requirements:
    - Title: Max 60 characters.
    - Description: Max 160 characters. Compelling, professional, and optimized for local search.
    
    Format JSON:
    {
      "title": "Example Title",
      "description": "Example Description"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      title: data.title || `${service} - ${businessName} ${city}`,
      description: data.description || `${service} services by ${businessName} in ${city}. High quality results and affordable pricing.`
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: `${service} - ${businessName} ${city}`,
      description: `Professional ${service} in ${city} by ${businessName}. Contact us for more information and assistance.`
    };
  }
};

export const getCoordinates = async (fullAddress: string): Promise<{ lat: string; lng: string } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Find the approximate GPS coordinates (latitude and longitude) for the following physical address.
    Address: "${fullAddress}"
    
    Return the coordinates in JSON format.
    Format:
    {
      "lat": "29.7604",
      "lng": "-95.3698"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text || '{}');
    if (data.lat && data.lng) {
      return {
        lat: String(data.lat),
        lng: String(data.lng)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding Error:", error);
    return null;
  }
};
