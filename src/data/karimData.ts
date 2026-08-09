import { MemoryItem, RelationshipStage, RelationshipState, SchoolEvent } from '../types';

export const RELATIONSHIP_STAGES: RelationshipStage[] = [
  {
    id: 1,
    name: 'Teman Dekat',
    description: 'Kalian sudah lama berteman dekat di SMA. Karim suka bercanda dan mengganggu kamu.',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    minCloseness: 0,
  },
  {
    id: 2,
    name: 'Saling Nyaman & Perhatian',
    description: 'Karim mulai lebih sering menyapa dan perhatian saat kamu kelihatan lelah atau butuh bantuan.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    minCloseness: 20,
  },
  {
    id: 3,
    name: 'Mulai Terasa Berbeda',
    description: 'Karim kadang canggung saat bercanda romantis, tapi sering mendatangi kamu duluan.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    minCloseness: 40,
  },
  {
    id: 4,
    name: 'Curhat & Rahasia Bersama',
    description: 'Karim mulai berani menceritakan hal-hal pribadinya yang tidak pernah ia katakan ke orang lain.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    minCloseness: 55,
  },
  {
    id: 5,
    name: 'Perasaan Yang Makin Jelas',
    description: 'Gampang blushing dan menyangkal perasaannya dengan tsundere saat dijahili balik.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    minCloseness: 70,
  },
  {
    id: 6,
    name: 'Momen Emosional & Percaya',
    description: 'Kalian saling mengandalkan di masa-masa sulit. Karim tidak lagi ragu menunjukkan betapa berartinya kamu.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    minCloseness: 82,
  },
  {
    id: 7,
    name: 'Saling Menyadarinya',
    description: 'Tinggal menunggu keberanian untuk mengungkapkan perasaan masing-masing.',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    minCloseness: 90,
  },
  {
    id: 8,
    name: 'Pengakuan Cinta (Confession)',
    description: 'Karim mengakui perasaannya secara jujur dan tulus.',
    badgeColor: 'bg-red-100 text-red-800 border-red-300 shadow-sm',
    minCloseness: 95,
  },
  {
    id: 9,
    name: 'Berpacaran 💕',
    description: 'Kalian resmi berpacaran sebagai pasangan kekasih di SMA Garuda!',
    badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md',
    minCloseness: 100,
  },
];

export const INITIAL_RELATIONSHIP_STATE: RelationshipState = {
  affection: 15,
  trust: 25,
  closeness: 20,
  stage: 1,
  stageName: 'Teman Dekat',
  statusText: 'Sahabat sekelas yang suka jail',
  unlockedMilestones: ['Duduk bersebelahan sejak kelas 10', 'Tahu tempat favorit di kantin'],
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'story',
    content: 'Karim dan pemain adalah teman dekat sejak kelas 10 SMA Garuda.',
    createdAt: new Date().toISOString(),
    importance: 5,
  },
  {
    id: 'mem-2',
    category: 'preference',
    content: 'Karim paling suka es teh manis di kantin Mbok Jum dan nggak suka makanan terlalu manis.',
    createdAt: new Date().toISOString(),
    importance: 3,
  },
  {
    id: 'mem-3',
    category: 'joke',
    content: 'Pernah dihukum berdiri berdua di depan kelas karena ketawa pas pelajaran Pak Hendra.',
    createdAt: new Date().toISOString(),
    importance: 4,
  },
  {
    id: 'mem-4',
    category: 'fact',
    content: 'Karim sering mengeluh kalau bangun pagi tapi selalu berangkat paling cepat biar bisa ngobrol.',
    createdAt: new Date().toISOString(),
    importance: 3,
  },
];

export const DEFAULT_SCHOOL_EVENT: SchoolEvent = {
  id: 'evt-morning-1',
  title: 'Pagi Hari Sebelum Bel',
  period: 'Pagi Hari',
  location: 'Kelas 11-B / Chat HP',
  description: 'Matahari baru terbit. Suasana SMA Garuda masih tenang. Karim mengirim pesan sambil berjalan ke sekolah.',
  weather: 'Cerah Berawan',
  starterPrompt: 'Udah bangun? Awas kalau telat lagi kaya minggu lalu.',
  iconName: 'Sun',
};
