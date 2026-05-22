import { motion } from 'framer-motion';

const SectionCard = ({ title, description, icon, accent }) => (
  <motion.div whileHover={{ y: -6 }} className="rounded-3xl border border-white/20 bg-white/50 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5 hover:border-fuchsia-400 transition">
    <div className={`w-12 h-12 mb-5 rounded-2xl flex items-center justify-center bg-gradient-to-br ${accent}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default SectionCard;
