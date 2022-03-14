import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * A global utility for retrieving and analyzing feature flag data (from URL query parameters).
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {

  constructor(
    private _router: Router
  ) {}

  /**
   * Gets the value of a given feature flag (URL query parameter).
   * @param flag The feature flag to retrieve.
   * @returns The `string` value of the feature flag.
   */
  getFlagValue(flag: string): string {
    const queryStr: string = this._router.routerState.snapshot.url.split('?')[1];
    return new URLSearchParams(queryStr).get(flag);
  }

  /**
   * Determines whether or not a non-blank feature flag is present.
   * @param flag The feature flag to check.
   * @returns `true` if a non-blank feature flag value is present, `false` if not.
   */
  hasFeatureFlag(flag: string): boolean {
    const flagValue: string = this.getFlagValue(flag);
    return !!(flagValue && flagValue.trim());
  }

  /**
   * Determines if a given feature flag (URL query parameter) has a truthy value.
   * @param flag The feature flag to check.
   * @returns `true` if it has a truthy value, `false` if not or missing/blank.
   */
  hasTruthyFeatureFlag(flag: string): boolean {
    return this.hasFeatureFlag(flag) && !this.hasFalsyFeatureFlag(flag);
  }

  /**
   * Determines if a given feature flag (URL query parameter) has a falsy value.
   * @param flag The feature flag to check.
   * @returns `true` if it has a falsy value, `false` if not or missing/blank.
   */
  hasFalsyFeatureFlag(flag: string): boolean {
    const flagValue: string = this.getFlagValue(flag);
    return this.hasFeatureFlag(flag)
        && (['f', 'false', '0', 'n', 'no', 'off'].indexOf(flagValue.toLowerCase()) >= 0);
  }
}
