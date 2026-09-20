# LearnFeed content pipeline — research brief (one interest per run)

You are producing the content dataset for a personal learning feed app.
The reader is Hebrew-speaking. All display text (`*_he` fields) is in Hebrew; titles of
books/videos/articles stay in their original language.

## HARD RULES (non-negotiable)
1. NEVER invent content. Every book, person, publication, video and article must be real.
2. Every video and article URL must be copied EXACTLY from a WebSearch result URL you saw.
   Never construct or recall a YouTube ID or article URL from memory.
3. Quotes: only include `quote` if the exact wording appeared in a search result snippet.
   Otherwise omit the field. Never paraphrase into quotation marks.
4. "Chapter" cards are NOT chapter summaries. Each card is ONE core idea of the book, explained
   so the reader understands the idea itself and why it matters, in the book's own reading order
   (`chapter_index` is just the card's order; `chapter_title` is an optional pointer to where the
   idea comes from). Only ideas that are actually in the book, grounded in search results
   (Wikipedia / SparkNotes / LitCharts / publisher pages / reputable summaries), URLs in `sources`.
   If you cannot ground an idea, pick another book.
4b. Articles must still make sense when the reader sees them: never a preview, prediction or
   "who will win" piece about an event that has already happened, and no seasonal content that
   has expired. Older evergreen analysis from a strong publication is fine; freshness is second.
5. Books: only well-known, real books you are certain exist (correct title, author, year).
   If unsure about any, verify by searching; drop it if unverified.
   The list of an interest is anchored to ONE strong ranked list from the web ("best/most
   influential 100 books on <field>" from a major publication, university, or a widely used
   ranking such as Goodreads, Five Books, Blinkist or the Personal MBA list). Record it in
   `book_list_source` {name, url}. When a book's ideas are exhausted (all its main ideas have
   cards, typically 6-12), mark it `"status": "done"` and append the next book from that ranked
   list with `"status": "queued"` (keep at least 6 books with cards in progress).
5b. `title_he`: only the title of a real Hebrew edition. If no Hebrew edition exists, OMIT the
   field. The app then shows the original title. Never invent a Hebrew title.
6. The only web tool that works is WebSearch. WebFetch/curl are blocked. Do not waste calls on them.
7. Hebrew style: never write an English word in Hebrew letters (no "טריגר", "פודקאסט", "סטארט-אפ",
   "ניוזלטר", "מיינדסט"). If a Hebrew word exists, use it (גורם מפעיל, חברת הזנק, ידיעון, דפוס חשיבה).
   If the term must stay English, write it in Latin letters (podcast, YouTube, playoff, Click, Whirr).
   Proper names and book titles stay in their original spelling.
8. Output is ONE JSON file: `data/interests/<id>.json`, valid JSON, UTF-8, matching the schema below exactly.

## Schema
```json
{
  "id": "psychology",
  "name_he": "פסיכולוגיה והתנהגות אנושית",
  "name_en": "Psychology & Human Behavior",
  "tagline_he": "משפט אחד שמסביר מה התחום נותן לקורא",
  "books": [
    {
      "id": "b_thinking_fast_and_slow",
      "title": "Thinking, Fast and Slow",
      "title_he": "לחשוב מהר, לחשוב לאט",
      "author": "Daniel Kahneman",
      "year": 2011,
      "why_he": "משפט אחד: למה הספר הזה ברשימת ה-30 המובילים בתחום",
      "chapters_total": 38
    }
  ],
  "leaders": [
    {
      "id": "p_daniel_kahneman",
      "name": "Daniel Kahneman",
      "name_he": "דניאל כהנמן",
      "role_he": "פסיכולוג, חתן פרס נובל לכלכלה",
      "why_he": "משפט אחד למה הוא מוביל דעה בתחום",
      "videos": [
        {
          "youtube_id": "CjVQJdIrDJ0",
          "title": "Daniel Kahneman: The riddle of experience vs. memory | TED",
          "source_url": "https://www.youtube.com/watch?v=CjVQJdIrDJ0",
          "duration_min": 20,
          "blurb_he": "משפט אחד על מה הסרטון, מבוסס על הכותרת/תקציר בתוצאת החיפוש בלבד"
        }
      ]
    }
  ],
  "publications": [
    {
      "id": "pub_psychology_today",
      "name": "Psychology Today",
      "url": "https://www.psychologytoday.com",
      "desc_he": "משפט אחד על כתב העת",
      "articles": [
        {
          "title": "Exact title from the search result",
          "url": "https://exact.url/from/search/result",
          "published": "2026-09",
          "summary_he": "1-2 משפטים המבוססים אך ורק על הכותרת והסניפט של תוצאת החיפוש"
        }
      ]
    }
  ],
  "chapters": [
    {
      "book_id": "b_thinking_fast_and_slow",
      "chapter_index": 1,
      "chapter_title": "The Characters of the Story",
      "chapter_title_he": "הדמויות של הסיפור",
      "idea_he": "הרעיון המרכזי, כמשפט-כותרת של עד 12 מילים",
      "body_he": "3-4 משפטים שמסבירים את הרעיון עצמו ולמה הוא חשוב, בשפה פשוטה וברורה",
      "points_he": ["נקודה 1", "נקודה 2", "נקודה 3"],
      "apply_he": "משפט אחד: איך הרעיון נראה בפועל בחיים או בעבודה",
      "quote": "optional — only if seen verbatim in a search snippet",
      "sources": ["https://url/seen/in/search"]
    }
  ]
}
```

## Quantities per interest
- `books`: exactly 30. Mix classics and modern. `chapters_total` = real chapter count if you know it, else omit.
- `leaders`: exactly 10 living or historically central thought leaders with a real public video presence. Each with exactly 2 videos found via WebSearch (query like `"<name>" interview youtube` or `"<name>" talk site:youtube.com`). SHORT wins: prefer clips of 3-15 minutes (TED/TEDx talks, short interviews, single-question clips, highlights) over full podcast episodes or hour-long lectures. If the search result shows a duration, record it as `duration_min` (integer). Never add a video you know is longer than ~25 minutes when a shorter one by the same person exists.
- `publications`: exactly 5 real publications/writers that publish articles in the field (magazines, newsletters, blogs, journals for a lay reader). Each with 3 articles from 2025-2026 found via WebSearch (`site:<domain> <topic>`; add "2026" to the query). Israeli/Hebrew sources are welcome where relevant.
- `chapters`: cards of core ideas, in the book's order. First run: the first idea of 6 different books (the 6 most iconic). Weekly: 3 new ideas per active book (a book is exhausted when its main ideas are covered, typically 6-12 cards). The reader moves through a book by reacting to cards, so always keep ideas ahead of the reader. Ground each card with at least 2 search results.

## Working method
- Budget ~60-80 WebSearch calls. Batch several independent searches in one turn.
- Search for video and article URLs; copy them exactly. A YouTube ID is the `v=` parameter of a `youtube.com/watch?v=...` URL (11 characters). `youtu.be/<id>` is also fine.
- If a leader yields no verifiable video after 2 searches, replace the leader.
- Write the JSON with a heredoc via Bash, then validate with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>` and fix until valid.
- Final report: one paragraph — counts, anything you had to drop, any place your confidence is lower.
