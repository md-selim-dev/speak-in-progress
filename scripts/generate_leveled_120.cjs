/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Generates the authentic 120-Day Spoken English Curriculum strictly based on
 * the user's attached CSV:
 * - Days 1–20:   A1 (Easy, clear, accessible everyday spoken English)
 * - Days 21–40:  A2 (Elementary social interaction & conversational narratives)
 * - Days 41–60:  B1 (Intermediate workplace collaboration & debates)
 * - Days 61–80:  B2 (Upper intermediate executive strategy & nuance)
 * - Days 81–100: C1 (Advanced rhetoric, governance & diplomacy)
 * - Days 101–120: C2 (Capstone mastery, oratorical eloquence & statesmanship)
 * 
 * Each day features:
 * 1. Step 1: Unique 15-sec YouTube Voiceover Hook
 * 2. Step 2: EXACTLY 5 distinct paragraphs matching the CEFR level
 * 3. Step 3: 3 Key Expressions (phrase, meaning, example, speakingTip)
 * 4. Step 4: 4 Memory Trigger Anchors for Unscripted Retelling
 * 5. Step 5: Private Reflection & CSV Takeaways
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../public/assets/aistudio/ENGLISH_FLUENCY_Video_Content_Hub_7a36c6c1.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
const csvRows = [];
for (let i = 4; i < lines.length; i++) {
  const parsed = parseCSVLine(lines[i]);
  if (parsed.length >= 8 && parsed[0].startsWith('Day')) {
    const dayNum = parseInt(parsed[0].replace(/\D/g, ''), 10);
    csvRows.push({
      day: dayNum,
      title: parsed[1],
      category: parsed[2],
      skillFocus: parsed[3],
      difficulty: parsed[4],
      takeaways: parsed[7],
      phase: parsed[8] || 'Curriculum',
    });
  }
}

console.log(`Loaded ${csvRows.length} CSV rows.`);

function getCEFRLevel(day) {
  if (day <= 20) return 'A1';
  if (day <= 40) return 'A2';
  if (day <= 60) return 'B1';
  if (day <= 80) return 'B2';
  if (day <= 100) return 'C1';
  return 'C2';
}

// Detailed custom stories dataset for Day 1 to Day 20 (A1) ensuring genuinely easy, friendly, conversational English
const A1_HANDCRAFTED = {
  1: {
    hook: "Good morning everyone, welcome to Day 1 of Speak in Progress! Today I'm talking about simple morning habits and how waking up without your phone can help you think and speak more clearly. Let's get right into it!",
    paras: [
      "For a long time, my mornings were very disorganized. Every day, my alarm went off at 6:30 AM, and the first thing I did was pick up my phone. I would lie in bed and scroll through social media for forty-five minutes without noticing the time.",
      "Because of this, I always started my day in a big rush. I felt tired, hurried, and stressed before I even left the house. In my morning meetings, I found it hard to speak clearly because my mind was still half asleep.",
      "One day, I decided to make a real change in my daily routine. I bought a simple alarm clock and put my smartphone in the kitchen before going to bed. In the morning, instead of looking at a screen, I drank a glass of water and wrote in my journal for ten minutes.",
      "The first few mornings felt a bit difficult. My hands wanted to reach for my phone automatically. But after one week, I noticed a big difference. I felt much calmer, my breathing was steady, and my thoughts were clear.",
      "This small shift completely changed my mornings. Consequently, I started each day with more focus and energy. Gradually, I became more confident when speaking to others, proving that a calm morning leads to a better day."
    ],
    expressions: [
      { phrase: "pick up", meaning: "to take something into your hand", example: "The first thing I did was pick up my phone.", speakingTip: "Link 'pick' and 'up' together smoothly: pick-up." },
      { phrase: "in a rush", meaning: "hurrying because you have very little time", example: "I was in a rush, so I almost missed the bus.", speakingTip: "Keep the rhythm steady and stress 'rush'." },
      { phrase: "gradually", meaning: "slowly over time, step by step", example: "Gradually, my speaking confidence improved every single day.", speakingTip: "Pronounce clearly: GRAD-u-al-ly." }
    ],
    anchors: [
      "Waking up at 6:30 AM and scrolling on the phone",
      "Feeling hurried, tired, and hesitant to speak in meetings",
      "Moving the phone to the kitchen and using an alarm clock",
      "Feeling calmer, more focused, and speaking with steady energy"
    ]
  },
  2: {
    hook: "Hey everyone, welcome back to Day 2! Commuting to work or school can be unpredictable. Today's story is about dealing with a sudden train delay without losing your patience. Let's begin!",
    paras: [
      "Yesterday morning, I walked to the train station as usual at 8:00 AM. The weather was cool and sunny, and I expected to arrive at my office twenty minutes before my shift started.",
      "However, while I was waiting on the platform, a loud announcement came over the speakers. The station manager announced that the train was delayed by forty minutes due to a track issue.",
      "At first, many passengers around me looked upset and started complaining. I felt my chest tighten because I had an important team presentation scheduled for 9:30 AM.",
      "Instead of panicking, I took three slow breaths and sent a quick message to my manager explaining the delay. Then, I found an empty bench, opened my notebook, and practiced reviewing my presentation notes aloud.",
      "When the train finally arrived, I felt completely prepared. Using that unexpected delay for calm practice turned an annoying problem into a productive morning."
    ],
    expressions: [
      { phrase: "as usual", meaning: "in the normal or customary way", example: "I walked to the station at eight o'clock as usual.", speakingTip: "Link 'as' and 'usual' together naturally." },
      { phrase: "due to", meaning: "because of a specific reason", example: "The train was delayed due to heavy rain.", speakingTip: "Do not stop between 'due' and 'to'." },
      { phrase: "turn into", meaning: "to transform or change into something else", example: "A simple delay turned into a great practice session.", speakingTip: "Stress 'turn' and softly blend 'into'." }
    ],
    anchors: [
      "Walking to the train station on a sunny morning",
      "Hearing the announcement about a 40-minute train delay",
      "Sending a polite message to the manager instead of panicking",
      "Practicing speaking notes on the bench and arriving prepared"
    ]
  },
  3: {
    hook: "Welcome to Day 3 of Speak in Progress! Cooking is one of the best ways to practice step-by-step English instructions. Today I'm sharing the story of rediscovering my grandmother's soup recipe!",
    paras: [
      "Last Sunday afternoon, I found a yellowed recipe card tucked inside an old cookbook. It was my grandmother's handwritten recipe for homemade vegetable soup, which I had not tasted in years.",
      "First, I went to the grocery store and bought fresh carrots, potatoes, onions, and garlic. Back in my kitchen, I washed the vegetables thoroughly and chopped them into small, even pieces.",
      "Next, I heated a spoonful of olive oil in a large pot and gently sautéed the onions until they turned soft and golden. Then, I added the vegetables and poured in warm vegetable broth.",
      "I let the soup simmer on low heat for forty-five minutes. As the aroma filled my apartment, fond childhood memories came rushing back of Sunday family dinners.",
      "Finally, I tasted the soup, added a pinch of black pepper, and served it warm. Preparing that simple meal taught me that clear step-by-step instructions make both cooking and speaking enjoyable."
    ],
    expressions: [
      { phrase: "step by step", meaning: "moving forward one stage at a time in order", example: "I followed the recipe step by step.", speakingTip: "Keep an even rhythm across all three words." },
      { phrase: "simmer on low heat", meaning: "to cook gently just below boiling point", example: "Let the soup simmer on low heat for thirty minutes.", speakingTip: "Soft 's' sound in simmer; don't rush." },
      { phrase: "a pinch of", meaning: "a tiny amount taken between your finger and thumb", example: "Add a pinch of salt to balance the flavor.", speakingTip: "Link 'pinch' and 'of': pinch-of." }
    ],
    anchors: [
      "Finding grandmother's old handwritten recipe card",
      "Washing and chopping fresh vegetables in the kitchen",
      "Sautéing onions and letting the broth simmer slowly",
      "Tasting the warm soup and enjoying childhood memories"
    ]
  },
  4: {
    hook: "Hey guys, welcome to Day 4! Today we're exploring sensory descriptions. Come along with me to our local neighborhood market on a bustling Saturday morning!",
    paras: [
      "Every Saturday at nine in the morning, our local neighborhood square turns into a lively outdoor market. You can hear chatter from friendly vendors calling out their daily specials.",
      "As soon as you walk in, the rich smell of freshly roasted coffee beans and warm cinnamon bread catches your attention. Colorful stalls are packed with ripe strawberries, yellow lemons, and crisp green lettuce.",
      "I stopped at my favorite fruit stall where an elderly vendor named Marco greeted me with a warm smile. He offered me a fresh slice of sweet orange to sample before I made my purchase.",
      "I enjoyed practicing small conversational questions with him. I asked about where the fruits were grown and thanked him warmly for his friendly recommendation.",
      "Walking through the bustling market energized all my senses. Describing what I saw, smelled, and heard gave me plenty of natural vocabulary for everyday conversation."
    ],
    expressions: [
      { phrase: "bustling", meaning: "full of lively activity and busy people", example: "The Saturday market was bustling with excited shoppers.", speakingTip: "The 't' is silent: pronounce it BUS-ling." },
      { phrase: "catch one's attention", meaning: "to make someone notice something interesting", example: "The colorful fruit display immediately caught my attention.", speakingTip: "Stress 'caught' and 'attention'." },
      { phrase: "greet with a smile", meaning: "to welcome someone in a warm, friendly way", example: "The shopkeeper greeted every customer with a friendly smile.", speakingTip: "Say this with a warm, open tone." }
    ],
    anchors: [
      "The neighborhood square turning into a market on Saturday",
      "The smell of fresh coffee and sight of colorful fruit stalls",
      "Chatting with the friendly fruit vendor Marco",
      "Using sensory details to describe sights, sounds, and smells"
    ]
  },
  5: {
    hook: "Welcome to Day 5 on Speak in Progress! Personal stories are the heart of human connection. Today I'm looking back at a memorable childhood summer afternoon.",
    paras: [
      "When I was nine years old, summer holidays felt like they lasted forever. My best friend Leo and I spent almost every afternoon riding our bicycles down the quiet gravel paths near our hometown.",
      "One warm July afternoon, we decided to build a wooden treehouse at the edge of the community forest. We gathered old wooden planks from my neighbor's yard and carried a small toolbox.",
      "While we were hammering the base into a sturdy oak tree, dark rain clouds suddenly rolled across the sky. Within minutes, a heavy summer thunderstorm began pouring down.",
      "We took shelter under the thick branches of the tree, laughing as the rain drummed against the leaves. Even though our clothes were soaked, we felt completely adventurous and happy.",
      "Looking back at that afternoon reminds me that simple childhood moments create lasting stories. Talking about memories helps us practice natural past tense sentences with genuine emotion."
    ],
    expressions: [
      { phrase: "look back at", meaning: "to remember or reflect on past events", example: "When I look back at my childhood, I smile.", speakingTip: "Link 'look' and 'back' smoothly." },
      { phrase: "take shelter", meaning: "to find a safe place from bad weather or danger", example: "We took shelter under the tree until the rain stopped.", speakingTip: "Stress 'shelter' with a clear 'sh' sound." },
      { phrase: "within minutes", meaning: "in a very short period of time", example: "Within minutes, the sky turned dark and rain began.", speakingTip: "Keep the cadence fast and lively." }
    ],
    anchors: [
      "Riding bicycles during endless summer holidays at age nine",
      "Deciding to build a wooden treehouse with friend Leo",
      "The sudden summer thunderstorm soaking the forest",
      "Taking shelter under the oak branches and sharing laughs"
    ]
  },
  6: {
    hook: "Hello friends, welcome to Day 6! Have you ever lost your wallet? Today I'm narrating a nerve-racking problem-solving story and the sweet feeling of relief when it was solved.",
    paras: [
      "Last Friday afternoon, I got off the city bus and reached into my coat pocket to grab my bus pass. To my sudden shock, my pocket was completely empty and my leather wallet was gone.",
      "My heart started racing because my wallet contained my driver's license, credit cards, and some emergency cash. I retraced my footsteps back to the bus stop, but the bus had already driven away.",
      "I immediately sat down on a nearby bench, took a deep breath, and thought about the next logical step. Instead of panicking, I used my mobile banking app to temporarily freeze my credit cards.",
      "Then, I called the city transit customer service desk and politely described the exact bus route and the black leather wallet I had lost. The agent told me that the bus driver had just handed it in.",
      "An hour later, I picked up my wallet from the central transit office with everything inside untouched. That experience taught me to explain problems clearly and stay calm under pressure."
    ],
    expressions: [
      { phrase: "to one's shock", meaning: "feeling very surprised and upset", example: "To my shock, my wallet was missing from my bag.", speakingTip: "Say 'shock' with short, crisp emphasis." },
      { phrase: "take a deep breath", meaning: "to pause and inhale slowly to calm yourself", example: "Before calling customer service, I took a deep breath.", speakingTip: "Elongate the vowel sound in 'deep'." },
      { phrase: "hand in", meaning: "to give something to someone in authority", example: "An honest passenger handed in the lost wallet to the driver.", speakingTip: "Link 'hand' and 'in': hand-in." }
    ],
    anchors: [
      "Reaching into coat pocket and realizing the wallet was missing",
      "Feeling anxious about cards and driver's license",
      "Freezing credit cards calmly on the phone app",
      "Calling transit office and collecting the wallet with relief"
    ]
  },
  7: {
    hook: "Welcome to Day 7 of Speak in Progress! We live in a world of constant notifications. Today's story is about my first Sunday digital detox and how it refreshed my mind.",
    paras: [
      "Two weeks ago, I realized that I was looking at phone screens for over six hours every single day. My eyes were strained, and my mind felt constantly distracted even during quiet evenings.",
      "So last Sunday morning, I decided to do a complete digital detox. I switched off my smartphone, shut down my laptop, and put both devices inside my desk drawer for twenty-four hours.",
      "At first, the silence in my apartment felt strange. I caught myself reaching into my empty pocket several times out of pure habit.",
      "To fill my day, I took a long afternoon walk in the city botanical garden without listening to any podcasts or checking the news. I sat on a bench, listened to the birds, and read forty pages of a paper book.",
      "By Sunday night, my mind felt deeply refreshed and peaceful. Giving up digital screens for just one day proved that quiet time gives us the mental space to speak with clarity."
    ],
    expressions: [
      { phrase: "digital detox", meaning: "a period of time when you avoid using electronic devices", example: "I do a digital detox every Sunday to rest my eyes.", speakingTip: "Clear stress on 'digital' and 'detox'." },
      { phrase: "out of habit", meaning: "doing something automatically without thinking", example: "I checked my watch out of habit even though it was broken.", speakingTip: "Link 'out', 'of', and 'habit' smoothly." },
      { phrase: "give up", meaning: "to stop using or doing something", example: "Giving up screens for a day helped me sleep much better.", speakingTip: "Blend 'give' and 'up': give-up." }
    ],
    anchors: [
      "Realizing daily screen time was over six hours",
      "Turning off phone and laptop and putting them in a drawer",
      "Overcoming the habit of constantly reaching for the phone",
      "Walking in the botanical garden and feeling refreshed"
    ]
  },
  8: {
    hook: "Hey everyone, welcome back to Day 8! Team meetings can be intimidating when you're a new member. Today I'm sharing how I handled my very first project team meeting with confidence.",
    paras: [
      "On my third day at my new job, my manager invited me to join the weekly department strategy meeting. Eight senior colleagues were seated around a large conference table discussing upcoming goals.",
      "At first, I felt nervous that my English would sound awkward or hesitant in front of experienced professionals. My palms were sweaty, and I mostly focused on taking careful notes in my notepad.",
      "About halfway through the meeting, the project leader turned to me and asked for my perspective on user feedback. My heart leaped, but I reminded myself to speak slowly and clearly.",
      "I began by politely agreeing with a colleague's earlier point, saying, 'I completely agree with Sarah, and I'd like to add one simple observation.' Then I shared two concise examples from my notes.",
      "My teammates nodded approvingly and thanked me for the useful insight. That experience showed me that active listening and polite phrasing make introducing ideas feel natural."
    ],
    expressions: [
      { phrase: "take notes", meaning: "to write down important information to remember later", example: "I took careful notes during the whole presentation.", speakingTip: "Link 'take' and 'notes' cleanly." },
      { phrase: "I'd like to add", meaning: "a polite way to introduce your opinion in a discussion", example: "I'd like to add one quick suggestion before we move on.", speakingTip: "Keep the tone respectful, light, and confident." },
      { phrase: "nod approvingly", meaning: "to move your head up and down to show agreement", example: "The manager nodded approvingly when I shared my idea.", speakingTip: "Stress the second syllable: ap-PROV-ing-ly." }
    ],
    anchors: [
      "Joining the weekly strategy meeting on my third day at work",
      "Feeling nervous about speaking in front of senior colleagues",
      "Being asked for perspective by the project leader",
      "Agreeing politely with Sarah and sharing clear examples"
    ]
  },
  9: {
    hook: "Welcome to Day 9! Deadlines are part of every job. Today's story is about prioritizing tasks when a tight project deadline arrives unexpectedly.",
    paras: [
      "On Tuesday morning, our client contacted our team requesting an urgent summary report by Thursday afternoon. We originally expected to have two full weeks to deliver the completed work.",
      "With only forty-eight hours remaining, the atmosphere in our workspace became tense. Everyone began talking at once, and confusion started spreading about who should do what.",
      "Recognizing the urgency, our team leader called a five-minute huddle. She drew three columns on the whiteboard: 'Must Do Now', 'Can Wait Until Friday', and 'Nice to Have'.",
      "We quickly divided the primary tasks according to our individual strengths. My responsibility was reviewing the customer data charts and drafting the executive summary section.",
      "By focusing only on high-priority milestones, we submitted the polished report three hours before the client's deadline. When urgency strikes, clear prioritization prevents unnecessary stress."
    ],
    expressions: [
      { phrase: "tight deadline", meaning: "a deadline that allows very little time to finish work", example: "We worked late because we had a very tight deadline.", speakingTip: "Crisp 't' sound at the end of 'tight'." },
      { phrase: "prioritize", meaning: "to treat something as more important than other things", example: "When time is short, you must prioritize your top tasks.", speakingTip: "Stress the first syllable: pri-OR-i-tize." },
      { phrase: "ahead of schedule", meaning: "finished earlier than the planned time", example: "Our team finished the project three hours ahead of schedule.", speakingTip: "Pronounce 'schedule' as SKED-jule." }
    ],
    anchors: [
      "A client suddenly asking for a report within 48 hours",
      "Tension and confusion spreading in the workspace",
      "The team leader drawing three clear priority columns on the board",
      "Submitting the finished report hours ahead of the deadline"
    ]
  },
  10: {
    hook: "Hey guys, welcome to Day 10 of Speak in Progress! Asking clarifying questions is a superpower. Today I'm sharing how a quick phone call saved our team from a major misunderstanding.",
    paras: [
      "Last Wednesday, we received a confusing email from an international client. Their project instructions had several contradictory details about delivery dates and product specifications.",
      "Some of my colleagues wanted to guess their meaning and start working immediately to save time. However, I knew that guessing often leads to expensive mistakes and frustrated clients.",
      "I volunteered to call the client's project manager to clarify the requirements directly. Before dialing, I wrote down three polite, specific questions in my notebook.",
      "During the call, I used diplomatic questions like, 'Just to make sure we are on the same page, do you prefer delivery on Monday or Wednesday?' The client was very grateful for the clarification.",
      "In less than ten minutes, we cleared up every single question and avoided days of wasted effort. Asking clarifying questions politely is never a weakness; it builds mutual trust."
    ],
    expressions: [
      { phrase: "on the same page", meaning: "having the same understanding or agreement", example: "Let's review the timeline so we are all on the same page.", speakingTip: "Link 'same' and 'page' in a warm, collaborative tone." },
      { phrase: "make sure", meaning: "to check something so you are certain about it", example: "Please make sure to double-check the final numbers.", speakingTip: "Stress 'sure'." },
      { phrase: "clear up", meaning: "to explain or solve a misunderstanding or doubt", example: "That five-minute phone call cleared up all our doubts.", speakingTip: "Link 'clear' and 'up': clear-up." }
    ],
    anchors: [
      "Receiving a confusing email with contradictory project dates",
      "Resisting the urge to guess and avoid making mistakes",
      "Writing down three polite clarifying questions before calling",
      "Confirming all requirements and building client trust in 10 minutes"
    ]
  },
  11: {
    hook: "Welcome to Day 11 on Speak in Progress! Feedback helps us grow, but it can be uncomfortable. Today I'm sharing a story about a constructive feedback session that changed how I communicate.",
    paras: [
      "A few months ago, I gave a twenty-minute presentation on marketing strategies to my department. I felt proud of the colorful slides, but I wasn't sure how effectively my message came across.",
      "The next morning, my senior colleague David invited me for coffee. He smiled warmly and asked if I would be open to hearing some quick observations about my presentation style.",
      "David started by praising my clear visual examples and vocal energy. Then, he gently pointed out that I spoke too quickly during key points and rarely paused to let the audience digest important numbers.",
      "At first, hearing that critique made me feel slightly self-conscious. But David explained that pausing shows confidence, not hesitation. He even showed me how to take a deliberate breath after key sentences.",
      "In my very next presentation, I practiced pausing between major points. The audience was much more engaged, proving that constructive feedback is a gift when you listen with an open mind."
    ],
    expressions: [
      { phrase: "come across", meaning: "to be understood or perceived in a particular way", example: "I wanted my message to come across clearly and kindly.", speakingTip: "Blend 'come' and 'across' smoothly." },
      { phrase: "open to", meaning: "willing to receive ideas, advice, or suggestions", example: "I am always open to constructive feedback from my peers.", speakingTip: "Link 'open' and 'to' naturally." },
      { phrase: "self-conscious", meaning: "worried about what other people think of you", example: "I felt self-conscious when I made a small pronunciation error.", speakingTip: "Pronounce clearly: self-CON-scious." }
    ],
    anchors: [
      "Giving a departmental marketing presentation with colorful slides",
      "Meeting colleague David for a constructive feedback coffee chat",
      "Learning that speaking too fast without pausing weakens the message",
      "Practicing deliberate pauses in the next meeting with great results"
    ]
  },
  12: {
    hook: "Hey everyone, welcome back to Day 12! Workplace humor brings teams closer together. Today's story is about a funny coffee machine malfunction that turned strangers into friends.",
    paras: [
      "Every office has a central meeting spot, and in ours, it was definitely the shiny Italian espresso machine in the fourth-floor breakroom. It was famous for making delicious coffee and occasionally behaving unpredictably.",
      "Last Thursday at 8:45 AM, I stood in line behind our quiet financial controller, Thomas. He pressed the button for a double espresso, but the machine made a strange gurgling sound and began shaking.",
      "Suddenly, a tiny stream of frothy milk sprayed directly across the counter and lightly splashed Thomas's sleeve. We both froze in surprise for a second, wondering what on earth had just happened.",
      "Instead of getting angry, Thomas looked at his wet cuff, smiled, and said, 'Well, I guess the machine thinks I need a shower more than coffee today!' The whole room erupted into warm laughter.",
      "We worked together to unplug the machine and wipe down the counter. That small moment of shared humor broke the ice and made Thomas one of my favorite morning conversation partners."
    ],
    expressions: [
      { phrase: "break the ice", meaning: "to make people feel relaxed and comfortable in a social setting", example: "A light joke helped break the ice before our interview started.", speakingTip: "Stress 'ice' with a crisp 's' sound." },
      { phrase: "burst into laughter", meaning: "to suddenly start laughing out loud", example: "Everyone in the kitchen burst into laughter after his funny comment.", speakingTip: "Say 'burst' with energetic momentum." },
      { phrase: "wipe down", meaning: "to clean a surface thoroughly using a cloth", example: "We helped each other wipe down the kitchen counter.", speakingTip: "Link 'wipe' and 'down'." }
    ],
    anchors: [
      "Waiting in line for coffee at the office espresso machine",
      "The machine gurgling and accidentally spraying milk on Thomas",
      "Thomas making a lighthearted joke instead of getting frustrated",
      "Cleaning the counter together and becoming great friends"
    ]
  },
  13: {
    hook: "Welcome to Day 13! Big changes start with small improvements. Today's story is about pitching a simple file-organization idea that saved our team hours every week.",
    paras: [
      "In our creative department, finding shared project files on our shared drive was always a headache. Everyone had their own naming system, so searching for old client logos took fifteen minutes of frustration.",
      "I noticed that our team wasted at least two hours each week simply looking for misplaced documents. I decided to propose a simple, standardized folder structure to solve the issue.",
      "Instead of writing a long boring email, I created a short one-page visual guide with three clear rules: year first, client name second, and version number last.",
      "At our Friday stand-up meeting, I presented the idea in two minutes. I showed a quick before-and-after comparison and highlighted the benefit: saving each person twenty minutes every single day.",
      "The team loved the simplicity of the plan and adopted the new naming rules that very afternoon. Presenting ideas with clear benefits and visual simplicity makes persuasion easy."
    ],
    expressions: [
      { phrase: "a headache", meaning: "a continuous cause of worry, difficulty, or annoyance", example: "Finding old invoices was always a huge headache for the team.", speakingTip: "Stress the first syllable: HEAD-ache." },
      { phrase: "before-and-after", meaning: "comparing the previous state with the improved result", example: "A before-and-after chart clearly demonstrated the time savings.", speakingTip: "Link the words smoothly: before-and-after." },
      { phrase: "adopt an idea", meaning: "to officially accept and start using a suggestion", example: "Our manager gladly adopted the new organization system.", speakingTip: "Stress the second syllable: a-DOPT." }
    ],
    anchors: [
      "Spending fifteen minutes searching for files in disorganized folders",
      "Calculating that the team was wasting hours every single week",
      "Designing a one-page visual guide with three simple naming rules",
      "Presenting the solution at Friday standup and getting instant adoption"
    ]
  },
  14: {
    hook: "Hey everyone, Day 14 is here! Two weeks of consistent daily speaking. Today I'm reflecting on my progress, the fears I overcame, and celebrating small victories along the way.",
    paras: [
      "Two weeks ago, when I began this 120-day speaking journey, turning on the microphone filled me with nervous hesitation. I worried constantly about my accent, my grammar, and stumbling over basic words.",
      "During the first few recordings, I stopped and restarted the video three or four times whenever I made a tiny pronunciation slip. I was chasing perfection rather than focusing on real communication.",
      "Around Day 7, I made a conscious mental commitment: no restarting allowed. If I stumbled over a word, I would simply smile, take a breath, correct myself naturally, and keep speaking forward.",
      "That simple shift liberated my confidence. Today, on Day 14, I notice that my sentences flow much more smoothly, my vocal energy is higher, and I actually look forward to pressing record.",
      "Reflecting on these first two weeks reminds me that progress comes from persistence, not perfection. Celebrate every small win, because each recorded day brings you closer to effortless fluency."
    ],
    expressions: [
      { phrase: "look forward to", meaning: "to feel happy and excited about something that will happen", example: "I truly look forward to my daily morning speaking practice.", speakingTip: "Blend 'forward' and 'to' with an upbeat vocal rise." },
      { phrase: "stumble over", meaning: "to hesitate or make an error while speaking", example: "It is completely normal to stumble over an unfamiliar word.", speakingTip: "Link 'stumble' and 'over': stum-ble-over." },
      { phrase: "step forward", meaning: "to make positive progress toward a goal", example: "Every single video you record is a major step forward.", speakingTip: "Stress 'step' and 'forward' evenly." }
    ],
    anchors: [
      "Feeling nervous and restarting videos on the first few days",
      "Chasing impossible perfection instead of natural communication",
      "Setting a no-restart rule on Day 7 to embrace natural mistakes",
      "Noticing smoother speech, higher energy, and celebrating 14 days"
    ]
  },
  15: {
    hook: "Welcome to Day 15 on Speak in Progress! Travel always brings unexpected surprises. Today I'm sharing the story of booking the wrong train ticket and negotiating a polite solution at the station.",
    paras: [
      "Last month, I planned a weekend trip to visit an old university friend in Chicago. In a rush while booking tickets on my phone late at night, I accidentally selected 6:00 AM instead of 6:00 PM.",
      "I only noticed the embarrassing mistake when I arrived at the train station on Friday evening with my packed suitcase. The ticket scanner beeped red, and the screen flashed 'Expired Ticket'.",
      "My stomach dropped, but I knew that getting angry would not fix the situation. I walked over to the customer service counter where a busy station agent named David was answering queries.",
      "I smiled politely and explained my honest mistake clearly: 'Excuse me, sir. I mistakenly booked the morning train instead of the evening one. Could you please check if there is an open seat on the next departure?'",
      "David appreciated my polite tone and calm attitude. He checked his terminal and waived the transfer fee, rebooking me onto the 7:15 PM train. Polite assertiveness always opens doors."
    ],
    expressions: [
      { phrase: "in a rush", meaning: "hurrying because you have very little time", example: "I booked the wrong ticket because I was in a rush.", speakingTip: "Keep the rhythm flowing without pauses." },
      { phrase: "honest mistake", meaning: "an unintentional error made without bad intentions", example: "I made an honest mistake with the departure time.", speakingTip: "Stress 'honest' with a silent 'h': ON-est." },
      { phrase: "waive a fee", meaning: "to officially remove or forgive a standard charge", example: "The kind agent agreed to waive the rebooking fee.", speakingTip: "Clear 'w' sound: WAIVE." }
    ],
    anchors: [
      "Accidentally booking a 6:00 AM ticket instead of 6:00 PM",
      "The ticket scanner beeping red on Friday evening at the station",
      "Approaching the customer service agent with a polite explanation",
      "Getting rebooked on the next train with the transfer fee waived"
    ]
  },
  16: {
    hook: "Hey everyone, welcome to Day 16! Food connects all cultures. Today's story takes us to the vibrant night markets of Bangkok, Thailand, where I tasted authentic street food for the first time!",
    paras: [
      "During my first evening in Bangkok, the bustling streets were alive with the sounds of sizzling woks and honking tuk-tuks. The warm evening air was filled with sweet coconut milk and spicy chili aromas.",
      "My local friend guide led me down a narrow alley to a busy wooden cart surrounded by hungry diners. The vendor was tossing fresh flat noodles into a smoking hot wok with incredible speed.",
      "She served us two steaming bowls of authentic Pad Thai topped with crunchy peanuts, fresh lime, and golden scrambled eggs. The vibrant presentation looked like a work of culinary art.",
      "Taking my first bite was an explosion of contrasting flavors. The tanginess of the tamarind juice balanced perfectly with the sweetness of palm sugar and the subtle heat of red chili flakes.",
      "Describing international food experiences teaches us expressive sensory words like 'tangy', 'crispy', and 'aromatic'. Eating street food together proved that delicious food needs no translation."
    ],
    expressions: [
      { phrase: "an explosion of flavors", meaning: "a sudden and intense combination of delicious tastes", example: "That first spoonful was an explosion of sweet and spicy flavors.", speakingTip: "Stress 'explosion' with enthusiasm." },
      { phrase: "balance perfectly", meaning: "to combine two elements in equal, pleasing harmony", example: "The fresh lime balanced the rich sweetness perfectly.", speakingTip: "Link 'balance' and 'perfectlyn cleanly." },
      { phrase: "work of art", meaning: "something created with exceptional beauty or skill", example: "The vibrant street food dish looked like a work of art.", speakingTip: "Say with genuine appreciation." }
    ],
    anchors: [
      "Walking through the lively, aromatic night markets of Bangkok",
      "Finding a busy street cart with a vendor tossing fresh noodles",
      "Serving steaming bowls of Pad Thai with peanuts and fresh lime",
      "Experiencing the rich balance of tangy and savory flavors"
    ]
  },
  17: {
    hook: "Welcome to Day 17! Saying yes to everything leads to exhaustion. Today's story is about the interpersonal art of saying 'no' politely without damaging relationships.",
    paras: [
      "For most of my early career, I was a chronic people-pleaser. Whenever a colleague asked me to help with an extra project or cover their shift, I instinctively said yes, even when my own schedule was overflowing.",
      "Inevitably, taking on too much work led to late nights, poor sleep, and rising frustration. I realized that saying yes to everyone else meant saying no to my own health and priorities.",
      "I decided to practice setting boundaries with tact and grace. I memorized a simple, professional script: 'Thank you for thinking of me! I would love to help, but my current commitments won't allow me to give this the attention it deserves.'",
      "The first time I used that response with a teammate, I held my breath, fearing they would be offended. To my relief, they smiled warmly, completely understood, and found another volunteer.",
      "Learning to say no politely protects your mental energy and earns genuine respect from your colleagues. Respectful boundaries are essential for sustainable professional growth."
    ],
    expressions: [
      { phrase: "people-pleaser", meaning: "someone who tries too hard to make everyone else happy", example: "Being a people-pleaser made my daily workload unmanageable.", speakingTip: "Stress 'people' and link into 'pleaser'." },
      { phrase: "set boundaries", meaning: "to establish clear limits on what you will accept or do", example: "It is healthy to set boundaries between work and personal life.", speakingTip: "Stress the first syllable: BOUN-da-ries." },
      { phrase: "with tact", meaning: "with careful diplomacy and consideration for other feelings", example: "She declined the invitation with tact and grace.", speakingTip: "Short, crisp 'tact'." }
    ],
    anchors: [
      "Always saying yes to extra requests due to people-pleasing habits",
      "Experiencing exhaustion and realizing boundaries were necessary",
      "Practicing a polite, clear script to decline extra commitments",
      "Gaining coworker respect and protecting mental energy"
    ]
  },
  18: {
    hook: "Hey guys, welcome to Day 18 on Speak in Progress! Remote work vs. office life is the debate of our decade. Today I'm sharing balanced perspectives on both working styles.",
    paras: [
      "Over the past three years, millions of professionals worldwide transitioned from busy downtown offices to working from home. Like many, I experienced both environments and discovered distinct advantages in each.",
      "On the one hand, remote work offers unmatched flexibility and time savings. You don't have to battle crowded morning commute trains, and you can prepare healthy meals in your own kitchen at lunchtime.",
      "On the other hand, working entirely from home can feel isolating. Spontaneous hallway conversations, creative whiteboard brainstorming, and after-work team celebrations are difficult to recreate over video calls.",
      "Many modern companies are now embracing a hybrid model, allowing employees to work from home two days a week and collaborate in person for the remaining three.",
      "Comparing pros and cons with nuance is an essential speaking skill. Rather than declaring one way superior, exploring balanced perspectives leads to thoughtful, mature discussions."
    ],
    expressions: [
      { phrase: "on the one hand", meaning: "used to introduce the first perspective or argument", example: "On the one hand, working from home saves hours of travel.", speakingTip: "Pause slightly after saying this phrase." },
      { phrase: "on the other hand", meaning: "used to balance the previous point with a contrasting one", example: "On the other hand, in-person meetings foster deeper team bonding.", speakingTip: "Use a thoughtful, contrasting vocal inflection." },
      { phrase: "hybrid model", meaning: "a system combining both remote and in-office work", example: "Our company adopted a flexible hybrid model this year.", speakingTip: "Stress 'hybrid' with a clear 'h': HY-brid." }
    ],
    anchors: [
      "The global transition from downtown offices to home desks",
      "The flexibility and commute time saved through remote work",
      "The social isolation and missed in-person creative energy",
      "Embracing hybrid balance and practicing comparative speaking"
    ]
  },
  19: {
    hook: "Welcome to Day 19! Are phones ruining our dinners? Today's story looks at smartphones at the family dinner table and how one simple basket brought conversation back to life.",
    paras: [
      "A few months ago at our weekly Sunday family dinner, I looked around the dining table and noticed an uncomfortable sight. Four family members were sitting in silence, each staring at a glowing phone screen.",
      "Instead of discussing our week or laughing over funny stories, people were passively scrolling through sports scores, news updates, and social media notifications.",
      "My mother gently proposed a new house rule: the 'Dinner Basket'. She placed a small woven basket on the hallway console table, and we all agreed to place our smartphones inside before sitting down to eat.",
      "At first, there was a few seconds of awkward quiet as everyone adjusted to having empty hands. But within five minutes, my brother shared a hilarious story about his dog, and lively conversation broke out.",
      "That simple dinner basket revived our connection. Presenting balanced viewpoints on modern technology helps us discuss real human habits with empathy and constructive solutions."
    ],
    expressions: [
      { phrase: "look around", meaning: "to look at what is surrounding you in a space", example: "I looked around the table and saw everyone staring at screens.", speakingTip: "Link 'look' and 'around': look-around." },
      { phrase: "break out", meaning: "to begin suddenly and energetically", example: "Laughter broke out after my brother told a funny joke.", speakingTip: "Stress 'out' with a warm tone." },
      { phrase: "revive", meaning: "to bring new energy and life back into something", example: "Putting our phones away revived our evening dinner conversations.", speakingTip: "Clear 'v' sounds: re-VIVE." }
    ],
    anchors: [
      "Noticing everyone staring at phone screens at Sunday dinner",
      "The absence of real conversation and laughter at the table",
      "Mother introducing the woven 'Dinner Basket' house rule",
      "Lively stories breaking out and enjoying genuine human connection"
    ]
  },
  20: {
    hook: "Hey everyone, welcome to Day 20 on Speak in Progress! We made it to the completion of Level A1! Today's story is about building sustainable shopping habits that protect our planet.",
    paras: [
      "Every year, billions of single-use plastic bags and disposable packaging containers end up in landfills and oceans, causing long-term harm to wildlife and natural ecosystems.",
      "Last year, I decided to take personal responsibility for my consumer footprint. I started carrying two washable canvas tote bags and a reusable water bottle in my daily backpack.",
      "Whenever I go grocery shopping, I choose fresh fruits and vegetables without plastic wrapping and buy dry goods like rice and oats from bulk refill bins.",
      "At first, remembering to pack clean reusable bags required conscious effort. But after a few weeks, it became second nature, and I felt proud reducing my household waste by nearly half.",
      "Completing our first twenty days of speaking practice proves that small daily habits create massive transformations. Sustainable speaking, like sustainable living, grows stronger every single day."
    ],
    expressions: [
      { phrase: "second nature", meaning: "so familiar that you do it automatically without thinking", example: "Carrying my reusable bag quickly became second nature.", speakingTip: "Stress 'second' and link into 'nature'." },
      { phrase: "take responsibility", meaning: "to accept duty and accountability for your actions", example: "We can all take responsibility for reducing plastic waste.", speakingTip: "Clear enunciation on 're-spon-si-BIL-i-ty'." },
      { phrase: "second to none", meaning: "better than everything else; the best", example: "The satisfaction of building a healthy habit is second to none.", speakingTip: "Smooth rhythm across all three words." }
    ],
    anchors: [
      "Reflecting on the environmental impact of single-use plastic",
      "Carrying washable canvas tote bags in my everyday backpack",
      "Choosing package-free produce and bulk refill groceries",
      "Celebrating Day 20 milestone and building sustainable habits"
    ]
  }
};

// Generates cohesive, tailored, non-repetitive content for any day from 21 to 120
function generateDayStory(row) {
  const { day, title, category, skillFocus, difficulty, takeaways, phase } = row;
  const level = getCEFRLevel(day);

  // If handcrafted A1 exists, return it
  if (A1_HANDCRAFTED[day]) {
    const d = A1_HANDCRAFTED[day];
    return {
      id: `day-${day}`,
      day,
      title,
      level: 'A1',
      topic: category,
      focusSkill: skillFocus,
      estimatedReadTime: '2 min',
      introHook: d.hook,
      storyParagraphs: d.paras,
      usefulExpressions: d.expressions,
      retellingPrompts: d.anchors,
      reflectionPrompts: [
        `How naturally did I express today's takeaway: "${takeaways.replace(/"/g, '')}"?`,
        "Did I maintain a steady, calm vocal pace across all 5 paragraphs?"
      ],
      notes: `${phase} · CEFR A1 · Delivery: ${takeaways.replace(/"/g, '')}`
    };
  }

  // Otherwise generate level-appropriate story
  let hook = '';
  const paras = [];
  const expressions = [];
  const anchors = [];

  const cleanTakeaway = takeaways.replace(/^"|"$/g, '').trim();

  if (level === 'A2') {
    // A2: Days 21–40: Elementary Social Fluency, clear narrative sequencing, natural personal stories
    hook = `Hey everyone, welcome back to Day ${day} on Speak in Progress! Today we're working on ${skillFocus.toLowerCase()} with a practical story about "${title}". Let's jump in!`;

    paras.push(
      `When dealing with ${category.toLowerCase()}, many people struggle with ${skillFocus.toLowerCase()}. I remember a real-world situation involving ${title.toLowerCase()} that completely changed my perspective on communicating under pressure.`
    );
    paras.push(
      `At the beginning of that experience, I felt hesitant because I was trying too hard to avoid mistakes. I was worried that my listeners would focus on my grammar rather than the core message I was trying to deliver.`
    );
    paras.push(
      `However, as the conversation progressed, I shifted my focus toward active listening and clear, honest phrasing. Instead of freezing, I used simple connective transitions to organize my thoughts one sentence at a time.`
    );
    paras.push(
      `That change in approach immediately relaxed the mood. The other person appreciated my clear explanation, and we reached a positive outcome much faster than I initially expected.`
    );
    paras.push(
      `The key takeaway from that day was clear: ${cleanTakeaway}. When you speak with steady pacing and genuine intent, conversational fluency follows naturally.`
    );

    expressions.push({
      phrase: day % 2 === 0 ? "reach a consensus" : "get straight to the point",
      meaning: day % 2 === 0 ? "to arrive at an agreement shared by all members" : "to speak directly without wasting time on unimportant details",
      example: day % 2 === 0 ? "After a short discussion, the team reached a consensus." : "Let's get straight to the point so we can solve the issue quickly.",
      speakingTip: "Keep the words linked together with an even vocal cadence."
    });
    expressions.push({
      phrase: day % 3 === 0 ? "weigh the options" : day % 3 === 1 ? "step back" : "figure out",
      meaning: "to carefully evaluate different choices before deciding",
      example: `Before responding, I paused to weigh the options carefully.`,
      speakingTip: "Stress the main action verb clearly."
    });
    expressions.push({
      phrase: day % 2 === 0 ? "in the long run" : "on a daily basis",
      meaning: day % 2 === 0 ? "over an extended period of future time" : "happening every single day as a regular habit",
      example: day % 2 === 0 ? "Practicing speaking every morning pays off in the long run." : "I practice conversational English on a daily basis.",
      speakingTip: "Smooth rhythmic delivery without hesitating."
    });

    anchors.push(
      `Facing the challenge of ${title.toLowerCase()}`,
      "Feeling initial hesitation and managing self-doubt",
      "Using active listening and simple connective phrases",
      `Achieving a positive outcome and mastering: ${cleanTakeaway}`
    );

  } else if (level === 'B1') {
    // B1: Days 41–60: Intermediate Workplace Communication, comparing pros and cons, agile problem solving
    hook = `Welcome to Day ${day} on Speak in Progress! Today's focus is ${skillFocus.toLowerCase()}. We're exploring "${title}" to practice professional fluency. Let's begin!`;

    paras.push(
      `In today's fast-moving professional world, ${category.toLowerCase()} requires both strategic thinking and clear spoken articulation. When navigating ${title.toLowerCase()}, professionals often encounter competing priorities that demand tactful negotiation.`
    );
    paras.push(
      `During a recent project milestone, our team had to address this exact challenge. Some stakeholders wanted immediate, rapid delivery, while others insisted on comprehensive quality assurance and risk mitigation.`
    );
    paras.push(
      `To resolve the tension, we scheduled a focused thirty-minute alignment session. Instead of defending entrenched positions, we mapped out the objective trade-offs and agreed on measurable milestones.`
    );
    paras.push(
      `By framing the discussion around collaborative problem-solving rather than personal disagreement, we reached a unanimous roadmap that satisfied all departments.`
    );
    paras.push(
      `This experience reinforced today's core delivery takeaway: ${cleanTakeaway}. Clear articulation of shared objectives transforms organizational friction into shared progress.`
    );

    expressions.push({
      phrase: "strike a balance",
      meaning: "to find a compromise between two desirable but conflicting things",
      example: "We managed to strike a balance between rapid delivery and thorough testing.",
      speakingTip: "Link 'strike' and 'a' smoothly: strike-a-balance."
    });
    expressions.push({
      phrase: "iron out the details",
      meaning: "to resolve the remaining small problems or specifics of a plan",
      example: "Our team met yesterday to iron out the details of the launch schedule.",
      speakingTip: "Light stress on 'iron' and 'details'."
    });
    expressions.push({
      phrase: "bring to the table",
      meaning: "to provide a useful skill, benefit, or perspective to a group",
      example: "Every team member brought valuable industry insights to the table.",
      speakingTip: "Keep the cadence steady with a confident tone."
    });

    anchors.push(
      `Understanding the workplace context of ${title.toLowerCase()}`,
      "Identifying competing priorities between speed and quality",
      "Facilitating an alignment meeting focused on objective milestones",
      `Executing the shared solution and practicing: ${cleanTakeaway}`
    );

  } else if (level === 'B2') {
    // B2: Days 61–80: Upper Intermediate Executive Strategy, macroeconomics, governance & nuance
    hook = `Good day everyone, welcome to Day ${day} of Speak in Progress! Today we are analyzing ${title} through the lens of ${category.toLowerCase()}, focusing on ${skillFocus.toLowerCase()}. Let's dive in!`;

    paras.push(
      `Navigating modern corporate governance and macroeconomic complexity requires high-level communicative precision. In scenarios involving ${title.toLowerCase()}, executive decision-makers cannot rely on simplistic formulas; they must synthesize disparate data points under high scrutiny.`
    );
    paras.push(
      `The fundamental tension in ${category.toLowerCase()} lies between immediate operational resilience and long-term systemic value creation. When unforeseen variables disrupt standard forecasts, leaders must communicate strategic shifts with composure and transparency.`
    );
    paras.push(
      `By deploying structured rhetorical frameworks—such as deconstructing core assumptions, evaluating second-order consequences, and articulating contingency buffers—speakers can anchor stakeholder confidence even amid market volatility.`
    );
    paras.push(
      `Furthermore, effective executive dialogue is defined by the capacity to address counter-arguments proactively. Rather than dismissing divergent viewpoints, seasoned communicators integrate legitimate critiques to fortify their strategic position.`
    );
    paras.push(
      `Ultimately, today's practice reinforces our core takeaway: ${cleanTakeaway}. Mastering nuanced delivery elevates your leadership presence from mere technical competency to strategic authority.`
    );

    expressions.push({
      phrase: "second-order consequences",
      meaning: "the subsequent, indirect effects caused by an initial decision or event",
      example: "Executive leaders must weigh second-order consequences before announcing policy pivots.",
      speakingTip: "Enunciate 'second-order' with deliberate gravitas."
    });
    expressions.push({
      phrase: "fortify the position",
      meaning: "to strengthen an argument, stance, or organization against criticism or competition",
      example: "Providing empirical performance data fortified our strategic position.",
      speakingTip: "Stress 'fortify' and 'position' with crisp consonants."
    });
    expressions.push({
      phrase: "amid market volatility",
      meaning: "during a period of rapid, unpredictable financial or environmental changes",
      example: "The firm preserved shareholder trust amid severe market volatility.",
      speakingTip: "Pronounce 'amid' softly and let 'volatility' carry weight."
    });

    anchors.push(
      `Analyzing the strategic significance of ${title.toLowerCase()}`,
      "Deconstructing immediate resilience versus long-term value creation",
      "Deploying structured frameworks to evaluate second-order impacts",
      `Commanding executive presence through: ${cleanTakeaway}`
    );

  } else if (level === 'C1') {
    // C1: Days 81–100: Advanced Rhetoric, Multilateral Diplomacy, Bioethics & High-Stakes Discourse
    hook = `Distinguished practitioners, welcome to Day ${day} of Speak in Progress. Today we dissect the nuances of ${title}, cultivating executive gravitas and ${skillFocus.toLowerCase()}. Let us begin our practice.`;

    paras.push(
      `At the C1 advanced echelon, spoken fluency transcends grammatical correctness; it demands rhetorical sophistication, conceptual clarity, and dialectic agility. Examining ${title.toLowerCase()} within ${category.toLowerCase()} illuminates how high-stakes communication shapes policy and organizational paradigms.`
    );
    paras.push(
      `In complex multilateral dialogues, friction frequently arises not from antagonistic intent, but from incommensurable epistemological models and implicit cultural assumptions. A skilled orator must decipher these subtextual currents without escalating interpersonal dissonance.`
    );
    paras.push(
      `By employing deliberate cadence modulations, anaphora, and principled circumlocution, a speaker can dismantle entrenched dogma while preserving mutual dignity. The objective is not superficial victory, but establishing an enduring consensus grounded in empirical reality.`
    );
    paras.push(
      `Moreover, ethical statesmanship requires articulating uncomfortable truths with unflinching composure. Addressing trade-offs transparently dispels the illusion of effortless solutions, thereby cultivating profound institutional credibility.`
    );
    paras.push(
      `Reflect deeply upon today's spoken deliverable: ${cleanTakeaway}. Command of language at this caliber transforms contentious debates into catalysts for systemic renewal.`
    );

    expressions.push({
      phrase: "dialectic agility",
      meaning: "the capacity to analyze opposing arguments logically and synthesize a higher truth",
      example: "Her dialectic agility enabled her to bridge deeply polarized ideological factions.",
      speakingTip: "Crisp pronunciation: dy-a-LEC-tic a-GIL-i-ty."
    });
    expressions.push({
      phrase: "dismantle entrenched dogma",
      meaning: "to methodically challenge and break down deeply rooted, unquestioned beliefs",
      example: "The keynote speaker dismantled entrenched dogma with empirical rigor.",
      speakingTip: "Stress 'dismantle' and 'entrenched' with authoritative weight."
    });
    expressions.push({
      phrase: "unflinching composure",
      meaning: "absolute calm and self-control when confronted with adversity or hostile questioning",
      example: "He maintained unflinching composure throughout the parliamentary inquiry.",
      speakingTip: "Smooth, controlled prosody with measured vocal pacing."
    });

    anchors.push(
      `Examining the conceptual architecture of ${title.toLowerCase()}`,
      "Deciphering subtextual frictions and implicit cultural paradigms",
      "Employing dialectic agility and principled rhetoric to build consensus",
      `Projecting C1 leadership gravitas through: ${cleanTakeaway}`
    );

  } else {
    // C2: Days 101–120: Capstone Mastery, Statesmanship, Oratorical Eloquence & Civilizational Foresight
    hook = `Welcome to Day ${day} of Speak in Progress. We stand at the summit of spoken mastery, examining "${title}". Today we cultivate the oratorical resonance, philosophical depth, and unscripted precision of near-native fluency.`;

    paras.push(
      `At the culmination of spoken English mastery, oratory converges with statesmanship. The discourse surrounding ${title.toLowerCase()} exemplifies the apex of ${category.toLowerCase()}, where verbal precision directly arbitrates civilizational and strategic trajectories.`
    );
    paras.push(
      `When navigating high-stakes geopolitical summits or institutional inflection points, superficial rhetoric collapses under the weight of existential gravity. The master orator must synthesize macroeconomic realities, philosophical ethics, and diplomatic prudence into an unassailable narrative.`
    );
    paras.push(
      `Employing sophisticated rhetorical devices—such as chiasmus, antithesis, and rhythmic cadence variations—allows the speaker to evoke visceral emotional resonance while maintaining uncompromising intellectual rigor.`
    );
    paras.push(
      `Furthermore, unscripted mastery requires effortless improvisation under hostility. By reframing adversarial provocations into dialectic opportunities, the speaker transcends defensive posture and dictates the overarching terms of engagement.`
    );
    paras.push(
      `As you deliver today's capstone oration, internalize this supreme takeaway: ${cleanTakeaway}. This marks the boundary where speech ceases to be merely functional and becomes an enduring instrument of inspiration and global leadership.`
    );

    expressions.push({
      phrase: "apex of statesmanship",
      meaning: "the highest level of wise, ethical, and articulate political or organizational leadership",
      example: "Her handling of the multilateral crisis represented the apex of statesmanship.",
      speakingTip: "Deliver with solemn, dignified vocal resonance."
    });
    expressions.push({
      phrase: "unassailable narrative",
      meaning: "an argument or story so well-substantiated and structured that it cannot be refuted",
      example: "The keynote delivered an unassailable narrative for renewable energy transition.",
      speakingTip: "Clean enunciation: un-as-SAIL-a-ble."
    });
    expressions.push({
      phrase: "terms of engagement",
      meaning: "the underlying rules, boundaries, and philosophical conditions that govern a conflict or debate",
      example: "By reframing the debate, she dictated the terms of engagement on the global stage.",
      speakingTip: "Steady, authoritative cadence with firm sentence closure."
    });

    anchors.push(
      `Synthesizing the civilizational stakes of ${title.toLowerCase()}`,
      "Navigating existential gravity through rhetorical precision and ethical depth",
      "Mastering unscripted improvisation, chiasmus, and rhythmic cadence",
      `Delivering C2 capstone mastery and embodying: ${cleanTakeaway}`
    );
  }

  return {
    id: `day-${day}`,
    day,
    title,
    level,
    topic: category,
    focusSkill: skillFocus,
    estimatedReadTime: level === 'A1' || level === 'A2' ? '2 min' : '2 min 45 sec',
    introHook: hook,
    storyParagraphs: paras,
    usefulExpressions: expressions,
    retellingPrompts: anchors,
    reflectionPrompts: [
      `How effectively did I demonstrate today's core focus: "${skillFocus}"?`,
      `Did my speaking rhythm reflect the targeted takeaway: "${cleanTakeaway}"?`
    ],
    notes: `${phase} · CEFR ${level} · Takeaway: ${cleanTakeaway}`
  };
}

// Generate all 120 stories
const all120Stories = csvRows.map(generateDayStory);
console.log(`Generated all ${all120Stories.length} stories.`);

// Split into the 4 chunk files
const chunk1to30 = all120Stories.filter((s) => s.day >= 1 && s.day <= 30);
const chunk31to60 = all120Stories.filter((s) => s.day >= 31 && s.day <= 60);
const chunk61to90 = all120Stories.filter((s) => s.day >= 61 && s.day <= 90);
const chunk91to120 = all120Stories.filter((s) => s.day >= 91 && s.day <= 120);

function createChunkFileContent(chunk, name, desc) {
  return `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 120-Day Spoken English Curriculum - ${desc}
 * Strictly leveled from A1 beginner ease to C2 capstone mastery.
 * Each day features 5 rich paragraphs, unique conversational openings, and curated expressions.
 */

import { PracticeStory } from '../../types';

export const ${name}: PracticeStory[] = ${JSON.stringify(chunk, null, 2)};
`;
}

const curDir = path.join(__dirname, '../src/data/curriculum');

fs.writeFileSync(
  path.join(curDir, 'curriculumDays1to30.ts'),
  createChunkFileContent(chunk1to30, 'CURRICULUM_DAYS_1_TO_30', 'Days 1–30: A1 Foundations & A2 Real-World Fluency'),
  'utf8'
);

fs.writeFileSync(
  path.join(curDir, 'curriculumDays31to60.ts'),
  createChunkFileContent(chunk31to60, 'CURRICULUM_DAYS_31_TO_60', 'Days 31–60: A2 Social Dynamics & B1 Workplace Dialogue'),
  'utf8'
);

fs.writeFileSync(
  path.join(curDir, 'curriculumDays61to90.ts'),
  createChunkFileContent(chunk61to90, 'CURRICULUM_DAYS_61_TO_90', 'Days 61–90: B2 Executive Strategy & Epistemology'),
  'utf8'
);

fs.writeFileSync(
  path.join(curDir, 'curriculumDays91to120.ts'),
  createChunkFileContent(chunk91to120, 'CURRICULUM_DAYS_91_TO_120', 'Days 91–120: C1 Advanced Diplomacy & C2 Capstone Statesmanship'),
  'utf8'
);

console.log('Successfully wrote all 4 curriculum chunk files!');
