import React, { useEffect, useState } from 'react';
import { parseVocabulary } from '@/lib/csv';
import {
  answerCard,
  createState,
  loadStoredState,
  persistState,
} from '@/lib/vocabulary';
import Flashcard from '@/components/study/Flashcard';
import AnswerButtons from '@/components/study/AnswerButtons';
import SessionProgress from '@/components/study/SessionProgress';
import SessionComplete from '@/components/study/SessionComplete';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQscE1SHD-f5FSsioiGjT3js-78dqLwdBaXVULj3r0L8uNBpdgzWy49yui8aHCbA6ABmaATgcjFspez/pub?gid=914587573&single=true&output=csv';

export default function Home() {
  const [status, setStatus] = useState('loading');
  const [state, setState] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) throw new Error(`Word list request failed (${response.status})`);
      const words = parseVocabulary(await response.text());
      if (!words.length) throw new Error('Word list is empty');
      setRevealed(false);
      setState(createState(words, loadStoredState()));
      setStatus('ready');
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (state) persistState(state);
  }, [state]);

  const total = state ? state.sessionWords.length : 0;
  const done = state ? state.sessionIndex : 0;
  const currentWord = state && done < total ? state.sessionWords[done] : null;
  const sessionComplete = status === 'ready' && done >= total;

  const handleAnswer = (knewIt) => {
    setRevealed(false);
    setState((previous) => answerCard(previous, knewIt));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Daily review
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">Vocabulary</h1>
        </header>

        {status === 'loading' && (
          <div className="flex flex-1 flex-col items-center justify-center pb-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
            <p className="mt-4 text-sm text-gray-400">Loading your words…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
            <p className="text-base font-medium text-gray-900">We couldn&apos;t load your word list.</p>
            <p className="mt-2 text-sm text-gray-500">Check your connection and try again.</p>
            <button
              type="button"
              onClick={load}
              className="mt-7 h-12 rounded-full bg-[#007AFF] px-8 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && (
          <>
            <SessionProgress done={done} total={total} known={state.sessionKnown || 0} />

            {sessionComplete ? (
              <SessionComplete known={state.sessionKnown || 0} total={total} />
            ) : (
              <div className="flex flex-1 flex-col justify-center pb-6">
                <Flashcard
                  key={currentWord}
                  word={currentWord}
                  definition={state.definitions[currentWord] || ''}
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                />
                <div className="mt-6 min-h-[124px]">
                  {revealed && <AnswerButtons onAnswer={handleAnswer} />}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}