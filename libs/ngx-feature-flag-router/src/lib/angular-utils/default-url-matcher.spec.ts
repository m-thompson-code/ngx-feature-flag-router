import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { defaultUrlMatcher, getRoutePath } from './default-url-matcher';

const MOCK_SEGMENT_GROUP = {
    hasChildren: () => false,
} as UrlSegmentGroup;

describe('default-url-matcher', () => {

    describe('defaultUrlMatcher()', () => {
        it('should handle empty string paths', () => {
            const result = defaultUrlMatcher([] as UrlSegment[], MOCK_SEGMENT_GROUP, { path: '' } as Route);
    
            expect(result).toStrictEqual({
                consumed: [],
                posParams: {},
            });
        });
    
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
    
    describe('getRoutePath', () => {
        it('should get path from Route path property', () => {
            expect(getRoutePath({ path: 'moo/cow' } as Route)).toBe('moo/cow');
        });

        it('should get path from Route featureFlagPath property', () => {
            expect(getRoutePath({ featureFlagPath: 'feature/path' } as Route)).toBe('feature/path');
        });

        it('should prioritze path property over featureFlagPath property', () => {
            expect(getRoutePath({ path: 'moo/cow', featureFlagPath: 'feature/path' } as Route)).toBe('moo/cow');
        });

        it('should return empty string if no path is found', () => {
            expect(getRoutePath({} as Route)).toBe('');
        });
    });
});
