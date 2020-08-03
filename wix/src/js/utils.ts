import { BASE_DOMAINS } from './consts';

export function isSameDomain(candidate: string, hostname: string): boolean {
  return hostname === candidate || hostname.endsWith(`.${candidate}`);
}

export function isSameDomainBulk(domainsArray: string[], hostName: string) {
  return domainsArray.some((domain: string) => isSameDomain(domain, hostName));
}

export function isWix(hostname?: string) {
  return isSameDomainBulk(BASE_DOMAINS, hostname || location.hostname);
}
