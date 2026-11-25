# Likeness and real-people guardrail notes (Q7, 2026-11-25). Research notes, not legal advice.

Sources read:
- Blank Rome / Law360, right of publicity and AI, 2025-10-14: https://www.blankrome.com/news-and-events/breaking-down-intersection-right-publicity-law-ai/
  - US right of publicity is state law (a patchwork). It protects name, image, voice and likeness against unauthorised COMMERCIAL use, including AI replicas (Lehrman v. Lovo, SDNY, 2025).
  - Some states protect after death (CA, NY), some do not. Risk is highest in ads or implied endorsement. Expressive uses (news, satire, parody) get more First Amendment protection, but not absolutely.
  - NO FAKES Act and No AI FRAUD Act are proposals, not law.
  - Disclosure that content is AI-generated reduces risk, but does not cure it.
- EU AI Act Art. 50(4), applies from 2 Aug 2026: https://artificialintelligenceact.eu/article/50/
  - "Deep fake" means AI image, audio or video that resembles EXISTING persons, objects, places or events and would falsely appear authentic.
  - Deployers must disclose it as artificially generated. For evidently artistic or fictional work, disclosure is limited to saying the content is generated, in a way that does not hamper enjoyment.
  - Note that the definition also covers resembling existing PLACES and EVENTS, which matters for generated building images.
- Singapore: no explicit statute on commercial digital replicas, as of the SAL Practitioner article, 2026-01: https://journalsonline.academypublishing.org.sg/Journals/SAL-Practitioner/Technology/ctl/eFirstSALPDFJournalView/mid/595/ArticleId/2160/Citation/JournalsOnlinePDF
  - Remedies come from passing off, defamation, POHA and the Penal Code. Sexual deepfakes are criminal. See Bird & Bird: https://www.twobirds.com/en/insights/2026/singapore/saving-face-protecting-ones-likeness-in-the-age-of-ai
- UK: personality rights rest on passing off (CMS, 2025-01): https://cms.law/en/gbr/legal-updates/personality-rights-in-the-uk-possible-reform-on-the-horizon-to-address-ai-related-challenges

## Product rule for Architecture Magic
1. Generated scenes show ANONYMOUS, generic people (masons, crowds, clergy). No named person and no prompt like "in the style/face of X".
2. A prompt that names a real living person, or asks for a face of a named person, is refused or the name is stripped. Deceased historical figures are shown only as small anonymous figures, never as portraits.
3. Every generated image or clip carries a visible "AI-generated illustration, not a photo" label. Generated content is never presented as a record of a real event.
4. A fictional lookalike of a real person is still a risk when the result is recognisable and used commercially or implies endorsement. Fiction alone is not a safe harbour.
5. Uploaded photos (photo mode): do not store faces. Send the image only to the model, discard it after, and ask for the building only. Never identify people.

- Manus Terms (https://manus.im/terms, read 2026-11-25), §5.1/5.2: output is "as is"; the user is solely responsible for use of output, including third-party claims, and must not infringe third-party rights (IP, privacy). Manus does not claim ownership of output, and output may not be unique. Usage Policy: https://manus.im/usage
