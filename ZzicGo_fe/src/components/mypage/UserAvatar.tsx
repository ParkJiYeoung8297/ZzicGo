export default function UserAvatar({
  size = 100,
  imageUrl,
}: {
  size?: number;
  imageUrl?: string | null;
}) {
  const finalUrl = imageUrl
    ? `${imageUrl}`
    : "/profile_cheetah.png";

  return (
    <>
        <img
      src={finalUrl}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
    
    </>

  );
}
