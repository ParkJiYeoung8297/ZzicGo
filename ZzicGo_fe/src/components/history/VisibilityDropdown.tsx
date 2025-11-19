// src/components/history/VisibilityDropdown.tsx

type Props = {
  visibility: "PUBLIC" | "PRIVATE";
  setVisibility: (v: "PUBLIC" | "PRIVATE") => void;
};

export default function VisibilityDropdown({ visibility, setVisibility }: Props) {
  return (
    <select
      value={visibility}
      onChange={(e) => setVisibility(e.target.value as any)}
      className="bg-yellow-400 px-3 py-1 rounded-md shadow font-semibold"
    >
      <option value="PUBLIC">공개</option>
      <option value="PRIVATE">나만보기</option>
    </select>
  );
}
