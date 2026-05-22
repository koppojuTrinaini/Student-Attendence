import { motion } from 'framer-motion';

const tabs = [
  { title: 'Realtime', subtitle: 'Live updates', delay: 0 },
  { title: 'Secure', subtitle: 'Encrypted JWT', delay: 0.4 },
  { title: 'Mobile', subtitle: 'Touch-first UI', delay: 0.8 },
  { title: 'Reports', subtitle: 'Export ready', delay: 1.2 },
];

const FloatingTabs = () => {
  return (
    <div className="hidden lg:block pointer-events-none">
      <div className="relative w-[320px] h-[320px]">
        <div className="absolute -left-16 -top-20 w-60 h-60 rounded-full bg-fuchsia-400/30 dark:bg-fuchsia-600/20 blur-2xl floating-blob" />
        <div className="absolute -right-10 top-10 w-40 h-40 rounded-full bg-sky-400/25 blur-2xl floating-blob delay-200" />

        {tabs.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20, x: i % 2 === 0 ? -10 : 10 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: t.delay }}
            className="pointer-events-auto absolute w-56 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/75 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col gap-1"
            style={{ top: 20 + i * 56, left: i % 2 === 0 ? 12 : 140 }}
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">{t.subtitle}</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{t.title}</div>
            <div className="mt-2 h-[6px] rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 w-3/5" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FloatingTabs;
