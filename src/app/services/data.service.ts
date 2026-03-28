import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Poem, Memory } from '../models/universe.models';

// Embedded data to avoid HTTP issues in static hosting
const UNIVERSE_DATA = {
  typewriterLines: [
    "Somewhere in this universe…",
    "two strangers crossed paths.",
    "One ordinary day.",
    "One extraordinary moment.",
    "This is that story."
  ],
  passwords: ["love", "bus", "vizag", "forever", "heartbeat", "mystar", "youandme"],
  memories: [
  {
    icon: "🌮",
    title: "Street Food Nights",
    poem: "From street food nights to movie halls,\nThrough food,busy malls we spent roaming and eating—\nWe've built a world from dreamy desserts and spicy tastes,\nWith laughter, love, and boundless trust.",
    quote: "Even the simplest evenings felt magical just because you were there with me.",
    color: "rgba(212,166,90,0.08)"
  },
  {
    icon: "🎬",
    title: "Movie Halls",
    poem: "In every laugh, in every moments,\nBeing side by side and having a time of our own,\nYour hand in mine making all things right,\nMy heart is home when you're in sight.",
    quote: "The story on screen never mattered… you were always my favorite scene.",
    color: "rgba(107,155,209,0.08)"
  },
  {
    icon: "🛕",
    title: "Quiet Temples",
    poem: "From temples quiet to moonlit tides,\nFrom busy streets to lakeside rides,\nNo matter where, no matter when—\nMy heart finds peace with you again just like our visits to temples.",
    quote: "With you, even silence feels complete and full of meaning.",
    color: "rgba(201,122,138,0.08)"
  },
  {
    icon: "🌊",
    title: "Vizag Shore",
    poem: "You are the sunrise sunset on Vizag's shore,\nThe waves in my ocean's roar.\nThe prayer I whisper in the breeze,\nThe calm that brings my soul to peace.",
    quote: "Every wave reminds me how deeply I’m connected to you.",
    color: "rgba(107,155,209,0.10)"
  },
  {
    icon: "🏙️",
    title: "Hyderabad Dreams",
    poem: "In Hyderabad we chase our dreams,\nBut love is more than plans and schemes.\nIt's you beside me every day—\nMy constant in a world of day and night.",
    quote: "No matter where life takes us, I only feel right when you're part of it.",
    color: "rgba(212,166,90,0.07)"
  },
  {
    icon: "☕",
    title: "Shared Tea",
    poem: "Tea Time with you is one of the most calming moments,\nYou make my frozen silence ease.\nYou filled the spaces I had kept,\nWith dreams I didn't know I wept.",
    quote: "Our small talks and silly jokes mean more to me than anything else.",
    color: "rgba(201,122,138,0.07)"
  },
  {
    icon: "🚌",
    title: "Bus Rides Together",
    poem: "Through crowded roads and passing lights,\nIn quiet talks and shared long rides,\nTime slowed down when you were near,\nTurning ordinary moments into something to cherish.",
    quote: "Those journeys were never about the destination… they were about you.",
    color: "rgba(150,120,200,0.08)"
  },
  {
    icon: "📱",
    title: "Late Night Calls",
    poem: "Across the miles, through silent nights,\nYour voice became my guiding light.\nThough far apart, I always knew—\nMy heart was right there next to you.",
    quote: "Distance never felt real when I could hear your voice.",
    color: "rgba(120,180,160,0.08)"
  },
  {
    icon: "🌧️",
    title: "Rainy Day Thoughts",
    poem: "In every drop that kissed the ground,\nYour memories came pouring down.\nLike gentle rain on restless skies,\nYou lived within my thoughts and sighs.",
    quote: "Every rain reminds me of how much I wish you were beside me.",
    color: "rgba(100,140,200,0.08)"
  },
  {
    icon: "🎧",
    title: "Songs That Remind Me of You",
    poem: "Every melody, every line,\nSomehow leads me back to you and mine.\nIn every lyric, soft and true,\nI find a piece of me and you.",
    quote: "Some songs aren’t just songs anymore… they’re memories of us.",
    color: "rgba(200,120,160,0.08)"
  },
  {
    icon: "✨",
    title: "Random Little Moments",
    poem: "Not just the big days we recall,\nBut tiny moments mean it all.\nA glance, a smile, a passing word,\nIn them, the loudest love is heard.",
    quote: "It’s the little things with you that mean the most to me.",
    color: "rgba(180,150,90,0.08)"
  },
  {
    icon: "💭",
    title: "Thinking of You",
    poem: "In every thought, in all I do,\nThere’s always a piece that belongs to you.\nNo matter where or how I roam,\nYour love is where I feel at home.",
    quote: "No matter how busy life gets, you’re always on my mind.",
    color: "rgba(160,120,180,0.08)"
  }
],
  distanceQuotes: [
    "No matter where I go, my heart stays with you.",
    "The quiet love we built feels louder than anything else in my life.",
    "You're my favorite notification every day.",
    "Your sleepy voice is the sweetest lullaby.",
    "I'd share my fries with you—even the last one.",
    "Each message sent, each voice I hear — it draws you close, brings you near."
  ],
  poems: [
    { num: "01", lines: "I saw you once, but didn't know,\nA face from school, a distant glow.\nBut fate returned, and there you were—\nA quiet magic, soft and pure.", quote: "I never believed in fate until it brought me back to you." },
    { num: "03", lines: "Not all love starts with thunder loud,\nSome bloom beneath a passing cloud.\nA smile, a seat, a shared old ride,\nAnd love grew quietly by your side.", quote: "You weren't the plan—but you're the best thing that ever happened." },
    { num: "05", lines: "A bus seat led me to my fate,\nBeside you, time began to wait.\nIn every moment since that day,\nYou turned my sky from grey to May.", quote: "Even a silent bus ride turned into a lifetime of emotions with you." },
    { num: "06", lines: "You are the sunrise on Vizag shore,\nThe echo in my ocean's roar.\nThe prayer I whisper in the breeze,\nThe calm that brings my soul to peace.", quote: "When I look at you, I see my past, present, and future smiling back." },
    { num: "08", lines: "In every laugh, in every fight,\nIn shared cafes and soft twilight,\nYour hand in mine makes all things right,\nMy heart is home when you're in sight.", quote: "You showed me that real love is quiet, kind, and strong." },
    { num: "10", lines: "Your voice, a melody so dear,\nYour touch, a warmth that draws me near.\nWith you, each day's a sweeter song—\nIn your embrace is where I belong.", quote: "You are the calm to my chaos and the poetry in my pause." },
    { num: "12", lines: "You light the sky inside my chest,\nA flame that never takes its rest.\nYou are my calm, my wild, my bliss,\nMy every world begins with this.", quote: "You make my world bloom just by being in it." },
    { num: "16", lines: "I see forever when I see your smile,\nA glimpse of heaven that stays awhile.\nNo need for stars, no need for skies,\nI've found my universe in your eyes.", quote: "Just one look from you makes my entire day feel like a dream." },
    { num: "20", lines: "No tale I've read could quite compare\nTo the story that we've come to share.\nA tale of us, both raw and true,\nAnd every page begins with you.", quote: "You're the plot twist that made my story worth reading." },
    { num: "40", lines: "Your name's the poem I love to write,\nEach syllable, a beam of light.\nNo need for rhyme or perfect art—\nYou live within my beating heart.", quote: "You are my beginning, my middle, and everything after." }
  ],
  futureDreams: [
    "Road trips at sunrise", "Morning chai together", "Growing old slowly",
    "Cooking midnight meals", "First home, warm lights", "Watching the sea again",
    "Dancing in the kitchen", "A dog. Maybe two.", "Traveling the world",
    "Reading side by side", "Every boring Tuesday", "Every magical day"
  ]
};

@Injectable({ providedIn: 'root' })
export class DataService {
  getData(): Observable<typeof UNIVERSE_DATA> {
    return of(UNIVERSE_DATA);
  }

  getTypewriterLines(): string[] {
    return UNIVERSE_DATA.typewriterLines;
  }

  getMemories(): Memory[] {
    return UNIVERSE_DATA.memories;
  }

  getPoems(): Poem[] {
    return UNIVERSE_DATA.poems;
  }

  getDistanceQuotes(): string[] {
    return UNIVERSE_DATA.distanceQuotes;
  }

  getFutureDreams(): string[] {
    return UNIVERSE_DATA.futureDreams;
  }

  getPasswords(): string[] {
    return UNIVERSE_DATA.passwords;
  }

  checkPassword(input: string): boolean {
    return UNIVERSE_DATA.passwords.includes(input.trim().toLowerCase());
  }
}
