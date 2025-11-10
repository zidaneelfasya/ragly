// Utility functions for chat features

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffInHours < 168) { // Less than a week
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function generateInitials(fullName?: string, email?: string): string {
  if (fullName) {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  
  return 'U';
}

export function generateThreadTitle(content: string, maxLength: number = 50): string {
  // Clean up the content: remove extra whitespace and line breaks
  const cleaned = content.trim().replace(/\s+/g, ' ');
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Find the last complete word before maxLength
  const truncated = cleaned.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.75) {
    // If we found a space reasonably close to the end, use it
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  // Otherwise, just truncate at maxLength
  return truncated + '...';
}

// Generate a user code from user ID
export function generateUserCode(userId: string): string {
  return userId.replace(/-/g, '').substring(0, 8).toUpperCase();
}
