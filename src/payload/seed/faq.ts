import type { Payload } from "payload";
import { FAQ_PLACEHOLDER_MARK, FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";

/**
 * Seed the `faq` collection from FAQ_DEFAULTS, in both locales.
 *
 * Find-or-create by the Portuguese `question` so re-running doesn't duplicate
 * rows; `order` follows the array index within the whole list, which is also the
 * order inside each section. Skips revalidation so it can run outside a Next
 * request, like the other seeders.
 *
 * **It updates, so it overwrites.** A row whose Portuguese question already exists
 * is updated in place, in both locales — which means running this against a
 * database where she has edited an answer through `/admin` replaces her edit with
 * the code default. That is the right behaviour for a seeder whose job is to make
 * the database match the code, and the reason it is run by hand rather than on
 * deploy.
 *
 * `FAQ_DEFAULTS` is a flat Portuguese array with no locale dimension — the domain
 * holds one shape per concept, not one per locale — so the English answers live
 * here in `FAQ_EN`, matched to the Portuguese rows **by index**. Two things follow
 * from that and both matter:
 *
 *   · the two arrays must stay the same length and the same order, which
 *     `assertFaqEnMatchesDefaults` checks at seed time rather than letting a
 *     mismatch quietly shift every answer by one;
 *   · the Portuguese pass has to run first on each row, because a row is created
 *     with its Portuguese question and the English pass only updates it.
 */
export async function seedFaq(payload: Payload): Promise<void> {
  assertFaqEnMatchesDefaults();

  for (let i = 0; i < FAQ_DEFAULTS.length; i++) {
    const entry = FAQ_DEFAULTS[i];
    const englishEntry = FAQ_EN[i];
    const existing = await payload.find({
      collection: "faq",
      where: { question: { equals: entry.question } },
      limit: 1,
      overrideAccess: true,
      locale: "pt",
    });

    const shared = { overrideAccess: true, context: { skipRevalidate: true } } as const;
    // `category` and `order` are not localized, so the English pass repeats them
    // harmlessly; only `question` and `answer` differ between the two passes.
    const portuguese = {
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      order: i,
    };
    const english = {
      question: englishEntry.question,
      answer: englishEntry.answer,
      category: entry.category,
      order: i,
    };

    const id =
      existing.docs.length > 0
        ? existing.docs[0].id
        : (
            await payload.create({
              collection: "faq",
              data: portuguese,
              locale: "pt",
              ...shared,
            })
          ).id;

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "faq",
        id,
        data: portuguese,
        locale: "pt",
        ...shared,
      });
    }

    await payload.update({
      collection: "faq",
      id,
      data: english,
      locale: "en",
      ...shared,
    });
  }

  payload.logger.info(`  ✓ faq (${FAQ_DEFAULTS.length} entries, pt + en)`);
}

/**
 * The English FAQ, matched to `FAQ_DEFAULTS` by index.
 *
 * **Every row is translated, and this page is the exception that earns it.**
 * Everywhere else on the site English falls back to Portuguese until her polish
 * pass (master plan RISK-001), which costs an anglophone reader a page in the
 * wrong voice. Here it would cost them the page's entire content: /perguntas *is*
 * its twenty-five answers, and CONCEPT names sessions in English as one of the
 * four subjects the page exists to settle. A reader who arrives asking whether
 * this works in English cannot be answered in Portuguese.
 *
 * These are translations of her answers, not English copy of her own — the same
 * standing as every other translated string on the site, and the reason CON-002's
 * vocabulary is followed strictly: "analytical psychology", "depth psychology",
 * "clinical psychologist", never "Jungian analyst", which is a protected title she
 * does not hold.
 *
 * `FAQ_PLACEHOLDER_MARK` is deliberately never translated: the mark exists so a
 * placeholder row is unmistakable on the page, in the Markdown twin and in the
 * FAQPage structured data, and a translated mark would be one more string to grep
 * for before a deploy. There are no placeholders left in either locale, and
 * `assertFaqEnMatchesDefaults` is what keeps a future one from appearing in only
 * one of them.
 */
const FAQ_EN: Array<{ question: string; answer: string }> = [
  // -- About analysis --------------------------------------------------------
  {
    question: "What is your approach in your practice?",
    answer:
      "My clinical practice is grounded in analytical psychology (also known as depth psychology), developed by the Swiss psychiatrist Carl Gustav Jung. In practice, this means our work goes beyond relieving immediate symptoms. We explore the unconscious through the analysis of dreams, through imagination, and through understanding the symbols that run through your own history. The main focus is to foster deep self-knowledge and to support the process of “individuation” — the journey towards becoming your most authentic and whole self.",
  },
  {
    question: "Who is analytical psychotherapy for?",
    answer:
      "Analytical, or depth, therapy is for adolescents and adults dealing with matters such as anxiety, depression, life transitions, existential crises or conflict in their relationships. It is also a rich path for anyone who wants to expand their self-knowledge and understand their own patterns of behaviour better.",
  },
  {
    question: "How long does an analysis last?",
    answer:
      "There is no fixed term: analysis is medium- to long-term work, and it is you who decides whether to continue or to stop.",
  },
  {
    question: "Who brings the subject of a session?",
    answer:
      "The subject is always brought by you. The session is your space, and you are entirely free to speak about whatever you are feeling — something that happened in your week, an old distress, or even a dream you had. There is no “right” or “wrong” subject. My part is to listen actively and to guide you towards a deep understanding of whatever you bring.",
  },
  {
    question: "Do I need to bring my dreams written down?",
    answer:
      "It is not required, but it is very welcome. Dream analysis is a valuable way of reaching the unconscious in analytical psychology, so if you tend to remember your dreams and would like to bring your notes, they are excellent material for us to work with in session.",
  },

  // -- About career guidance -------------------------------------------------
  {
    question: "How many meetings does career guidance take?",
    answer:
      "Up to twelve weekly meetings, online. Twelve is the ceiling, not the target: how many meetings the course takes depends on you, and it has a beginning, a middle and an end.",
  },
  {
    question: "Which tests are used, and do they decide for me?",
    answer:
      "They are psychological tests applied within the process and read together with you. They decide nothing on your behalf: they return material that conversation alone cannot reach. Psychological tests may only be applied and interpreted by psychologists, and here they enter as working material rather than as a verdict — read in the light of your own history.",
  },
  {
    question: "What do I leave with at the end?",
    answer:
      "In the last movement we gather what has emerged and talk about what has become clear. It is not a report with a single answer: what you leave with is not only the answer but an understanding of how you arrived at it. That is what lets you choose again, if your life asks something else of you some years from now.",
  },
  {
    question: "Is career guidance the same as therapy, or as coaching?",
    answer:
      "No. Anyone looking for help with a career decision finds three things with similar names: a test that returns a list of professions, a goal-oriented form of support, and career guidance conducted within psychology. This is the third: it takes place within clinical psychology, with professional registration, a code of ethics, and confidentiality over everything you bring. And if, along the way, the question turns out to be a different one — not which profession, but why nothing feels enough — I say so, and analysis is the better path.",
  },

  // -- Practical -------------------------------------------------------------
  {
    question: "Are sessions online or in person?",
    answer: "At present I see people online only.",
  },
  {
    question: "How does an online session happen?",
    answer:
      "At the exact time of our appointment, I make a video call straight to your WhatsApp. The session lasts a standard fifty minutes, time set aside exclusively for our therapeutic work.",
  },
  {
    question: "Where should I be for an online session?",
    answer:
      "To protect confidentiality and to get the most out of the therapy, it is essential that you are somewhere private and quiet, with nobody else present or interrupting. I also recommend using headphones, and making sure you are somewhere with a good internet connection so we avoid drops in signal during the session.",
  },
  {
    question: "Is what I share in a session confidential?",
    answer:
      "Yes, confidentiality is 100% guaranteed. Everything discussed in a session is strictly confidential, in strict accordance with the Brazilian Psychologists' Code of Professional Ethics. Therapy is a safe and ethical space, free of judgement, made so that you can express yourself with complete ease.",
  },
  {
    question: "Do you see people fortnightly or monthly?",
    answer:
      "No — I work exclusively at a weekly frequency. That rhythm is essential if we are to build a solid therapeutic bond founded on trust. Beyond that, the method of analytical psychology requires this constancy for the work to be genuinely effective, allowing a continuous and safe deepening into your own questions.",
  },
  {
    question: "Can I ask for extra sessions if I feel the need?",
    answer:
      "Certainly. If you are going through a more delicate moment, a crisis, or simply feel the need for more intensive support, we can arrange additional sessions. Scheduling depends on my availability, and each extra session is charged separately from your monthly fee.",
  },
  {
    question: "What about fees?",
    answer:
      "We agree on fees before the first session, according to the format and how often we meet. To know the current fee, just write to me on WhatsApp; I reply within one working day.",
  },
  {
    question: "Is the first session charged?",
    answer:
      "Yes, the first session is charged. Both the fee and the times available should be agreed beforehand. To book, and to ask about fees, contact me directly on +55 11 96415-8128 (WhatsApp or phone).",
  },
  {
    question: "Can I pay for sessions afterwards, or at the end of the month?",
    answer:
      "No. The monthly fee is paid in advance, and I do not work with payment after sessions have taken place. Settlement is monthly, exclusively by PIX to my current account. I pass on the PIX key and the bank details while we are talking on WhatsApp.",
  },
  {
    question: "Does the monthly fee change if I miss a session, or if a month has fewer weeks?",
    answer:
      "No — payment works as a fixed monthly fee. That amount reserves your time in my diary exclusively, every week, and covers my continuous attention to your case. So it does not change because of a patient's absences, public holidays, or months with five weeks.",
  },
  {
    question: "How does the cancellation and rescheduling policy work?",
    answer:
      "Rescheduling is perfectly possible, as long as you ask at least 24 hours in advance. Because the time is reserved exclusively for you, an absence or a cancellation without that notice makes it impossible for me to offer the slot to another patient. Where notice comes at the last minute, the session cannot be rescheduled and is charged as normal.",
  },
  {
    question: "Do you take health insurance?",
    answer: "My sessions are 100% private.",
  },

  // -- International ---------------------------------------------------------
  {
    question: "How do appointment times work if I live in another time zone?",
    answer:
      "Brasília time is always the reference. I work out the difference with you and offer times that already fit your day.",
  },
  {
    question: "I live outside Brazil. How do I pay for sessions?",
    answer:
      "Payments for international sessions are received through Wise, which is quick and very secure. You only need to download the app on your phone or open the website on your computer. During our first contact I will give you all the guidance and the exact details you need to make the transfer without complications.",
  },
  {
    question: "Can sessions be in English?",
    answer:
      "Yes. Both analysis and career guidance take place in Portuguese or in English, whichever you prefer, by video call, wherever in the world you are.",
  },
  {
    question: "Is the work covered by any regulation?",
    answer:
      "The work follows Brazilian telepsychology regulation: this is how a Brazilian psychologist sees people living in other countries.",
  },
];

/**
 * The two arrays are joined by index and nothing else, so a length mismatch would
 * silently attach every English answer to the wrong Portuguese question. Fail at
 * seed time instead.
 */
function assertFaqEnMatchesDefaults(): void {
  if (FAQ_EN.length !== FAQ_DEFAULTS.length) {
    throw new Error(
      `FAQ_EN has ${FAQ_EN.length} entries and FAQ_DEFAULTS has ${FAQ_DEFAULTS.length}. ` +
        "They are matched by index, so they must stay the same length and the same order.",
    );
  }

  const misplaced = FAQ_DEFAULTS.findIndex(
    (entry, index) =>
      entry.answer.includes(FAQ_PLACEHOLDER_MARK) !==
      FAQ_EN[index].answer.includes(FAQ_PLACEHOLDER_MARK),
  );
  if (misplaced !== -1) {
    throw new Error(
      `FAQ row ${misplaced} is a placeholder in one locale and a real answer in the other. ` +
        "A placeholder must be unmistakable in both.",
    );
  }
}
