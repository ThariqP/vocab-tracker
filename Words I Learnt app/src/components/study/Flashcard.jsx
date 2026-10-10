import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const flip = { duration: 0.3, ease: 'easeInOut' };

export default function Flashcard({ word, definition, revealed, onReveal }) {
  const hasDefinition = Boolean(definition && definition.trim());

  return (
    <motion.button
      type="button"
      onClick={revealed ? undefined : onReveal}
      whileTap={revealed ? undefined : { scale: 0.98 }}
      aria-label={revealed ? word : `Reveal the definition of ${word}`}
      style={{ perspective: 1200 }}
      className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-white to-blue-50 p-8 text-center shadow-lg shadow-blue-900/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <motion.span
            key="word"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={flip}
            className="flex w-full flex-col items-center"
          >
            <span className="font-serif text-4xl italic leading-tight tracking-tight text-blue-900">
              {word}
            </span>
            <span className="mt-8 text-sm text-blue-900/40">Tap to reveal</span>
          </motion.span>
        ) : (
          <motion.span
            key="definition"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={flip}
            className="flex w-full flex-col items-center"
          >
            {hasDefinition ? (
              <>
                <span className="font-serif text-lg italic text-blue-900/60">{word}</span>
                <span className="mt-5 block text-left text-xl leading-relaxed text-blue-900">
                  {definition}
                </span>
              </>
            ) : (
              <>
                <span className="font-serif text-4xl italic leading-tight tracking-tight text-blue-900">
                  {word}
                </span>
                <span className="mt-5 block text-base italic text-blue-900/40">
                  No definition provided
                </span>
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}