/**
 * E-posta adresinin geçerli olup olmadığını kontrol eder.
 * Basit bir RFC 5322 uyumlu regex ile doğrulama yapar.
 * @param email Kontrol edilecek e-posta adresi
 * @returns Geçerli ise true, değilse false
 */
export function validateEmail(email: string): boolean {
  // Basit RFC 5322 uyumlu regex
  const re = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.[\w-]+)+$/;
  return re.test(email);
} 