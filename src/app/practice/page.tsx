import { Metadata } from 'next';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
    title: 'Foursquare Children Bible & Current Affairs Quiz Championship | Idimu Missionary District',
    description: 'Official Bible & Current Affairs Quiz Competition for children and teens across Foursquare Gospel Church in Nigeria. Compete in Book of Numbers, Standard of Attainment, and Church History.',
};

export default function PracticePage() {
    return <PracticeClient />;
}
