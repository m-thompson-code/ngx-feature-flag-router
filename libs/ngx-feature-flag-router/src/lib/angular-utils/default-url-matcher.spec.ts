import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { defaultUrlMatcher } from './default-url-matcher';

const MOCK_SEGMENT_GROUP = {
    hasChildren: () => false,
} as UrlSegmentGroup;

describe('defaultUrlMatcher()', () => {
    it('should return null if actual URL is shorter than the config, no match', () => {
        const result = defaultUrlMatcher([{ path: 'moo' }] as UrlSegment[], MOCK_SEGMENT_GROUP, { path: '/' } as Route);

        expect(result).toBeNull();
    });

    it('return ull if the config is longer than the actual URL but we are looking for a full match', () => {
        const result = defaultUrlMatcher([{ path: 'moo' }, { path: 'cow' }, { path: 'milk' }] as UrlSegment[], MOCK_SEGMENT_GROUP, {
            path: '/',
            pathMatch: 'full',
        } as Route);

        expect(result).toBeNull();
    });

    it('should get segments and posParams', () => {
        const result = defaultUrlMatcher([{ path: 'moo' }, { path: '123' }] as UrlSegment[], MOCK_SEGMENT_GROUP, {
            path: 'moo/:cow',
        } as Route);

        expect(result).toStrictEqual({
            consumed: [{ path: 'moo' }, { path: '123' }] as UrlSegment[],
            posParams: {
                cow: { path: '123' },
            },
        });
    });

    it('should return null if the actual URL part does not match the config', () => {
        const result = defaultUrlMatcher([{ path: 'moo' }, { path: 'cow' }] as UrlSegment[], MOCK_SEGMENT_GROUP, {
            path: 'moo/bull',
        } as Route);

        expect(result).toBeNull();
    });
});
