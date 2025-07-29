/**
 * Avatar Generator Utility
 * Generates cute smile face avatars for user profiles
 */

export function generateSmileFaceAvatar(username: string): string {
  // Generate a unique avatar based on the username using DiceBear API
  // This creates consistent, friendly avatars with proper fallback
  const seed = username.toLowerCase().replace(/[^a-z0-9]/g, ''); // Clean seed for consistency
  
  // Use the modern DiceBear API with adventurer style
  const baseUrl = 'https://api.dicebear.com/7.x/adventurer/svg';
  const params = new URLSearchParams({
    seed: seed || 'default',
    backgroundColor: 'FF8C00', // Orange background matching brand
    scale: '80',
    radius: '50',
    // Ensure consistent rendering
    format: 'svg'
  });
  
  const avatarUrl = `${baseUrl}?${params.toString()}`;
  console.log(`Generated avatar URL for ${username}: ${avatarUrl}`);
  return avatarUrl;
}

/**
 * Alternative smile face avatars using different styles
 */
export function generateAlternativeSmileFaceAvatar(username: string): string {
  const alternativeSmileAvatars = [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=1&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=2&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=3&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=4&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=5&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=6&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=7&mood=happy&backgroundColor=FF8C00',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=8&mood=happy&backgroundColor=FF8C00'
  ];
  
  const avatarIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % alternativeSmileAvatars.length;
  return alternativeSmileAvatars[avatarIndex];
}