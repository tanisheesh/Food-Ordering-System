interface CountryFlagProps {
  country: string;
  size?: number;
}

export default function CountryFlag({ country, size = 20 }: CountryFlagProps) {
  if (country === 'INDIA') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="8" fill="#FF9933"/>
        <rect y="8" width="24" height="8" fill="#FFFFFF"/>
        <rect y="16" width="24" height="8" fill="#138808"/>
        <circle cx="12" cy="12" r="3" stroke="#000080" strokeWidth="0.5" fill="none"/>
        <circle cx="12" cy="12" r="0.5" fill="#000080"/>
      </svg>
    );
  }
  
  if (country === 'AMERICA') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#B22234"/>
        <rect y="2" width="24" height="2" fill="#FFFFFF"/>
        <rect y="6" width="24" height="2" fill="#FFFFFF"/>
        <rect y="10" width="24" height="2" fill="#FFFFFF"/>
        <rect y="14" width="24" height="2" fill="#FFFFFF"/>
        <rect y="18" width="24" height="2" fill="#FFFFFF"/>
        <rect y="22" width="24" height="2" fill="#FFFFFF"/>
        <rect width="10" height="13" fill="#3C3B6E"/>
        <circle cx="2" cy="2" r="0.5" fill="#FFFFFF"/>
        <circle cx="5" cy="2" r="0.5" fill="#FFFFFF"/>
        <circle cx="8" cy="2" r="0.5" fill="#FFFFFF"/>
        <circle cx="2" cy="5" r="0.5" fill="#FFFFFF"/>
        <circle cx="5" cy="5" r="0.5" fill="#FFFFFF"/>
        <circle cx="8" cy="5" r="0.5" fill="#FFFFFF"/>
        <circle cx="2" cy="8" r="0.5" fill="#FFFFFF"/>
        <circle cx="5" cy="8" r="0.5" fill="#FFFFFF"/>
        <circle cx="8" cy="8" r="0.5" fill="#FFFFFF"/>
        <circle cx="2" cy="11" r="0.5" fill="#FFFFFF"/>
        <circle cx="5" cy="11" r="0.5" fill="#FFFFFF"/>
        <circle cx="8" cy="11" r="0.5" fill="#FFFFFF"/>
      </svg>
    );
  }
  
  return null;
}
