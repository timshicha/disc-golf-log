import { Adjectives, Nouns } from "./objects.mjs"

export const generateNoun = () => {
    const index = Math.floor((Math.random() * Nouns.length));
    return Nouns[index];
}


export const generateAdjective = () => {
    const index = Math.floor((Math.random() * Adjectives.length));
    return Adjectives[index];
}

// Generate a username (2 digits after)
export const generateUsername = () => {
    const number = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    return generateAdjective() + generateNoun() + number;
}