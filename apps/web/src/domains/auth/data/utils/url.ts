/**
 * URL 유틸리티
 *
 * OAuth state 파라미터 인코딩/디코딩
 */

/**
 * State 인코딩/디코딩 유틸리티
 */
export const state = {
  /**
   * State 객체를 Base64 문자열로 인코딩
   */
  encode: (data: Record<string, string>): string => {
    return Buffer.from(JSON.stringify(data)).toString("base64url");
  },

  /**
   * Base64 문자열을 State 객체로 디코딩
   */
  decode: (encoded: string): Record<string, string> => {
    try {
      const decoded = Buffer.from(encoded, "base64url").toString("utf-8");
      return JSON.parse(decoded);
    } catch {
      return {};
    }
  },
};
