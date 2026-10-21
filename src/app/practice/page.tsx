import { Metadata } from 'next';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
    title: 'Foursquare Idimu Children Quiz Practice Stage | Taiwo Lawal',
    description: 'Practice questions for the Book of Numbers and Standard of Attainment for children preparing for the Bible quiz competition.',
};

export default function PracticePage() {
    return <PracticeClient />;
}
