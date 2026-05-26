interface FileItem {
  id: string;
  name: string;
  tag: string;
  timeAgo: string;
  tagColor?: string;
}

interface RecentFilesSectionProps {
  files: FileItem[];
}

export default function RecentFilesSection({ files }: RecentFilesSectionProps) {
  return (
    <div className="liquid-glass rounded-[20px] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-grotesk font-bold text-cream">Tài liệu gần đây</h3>
        <button className="text-neon text-sm font-mono hover:brightness-125 transition">
          Xem tất cả →
        </button>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* File Icon */}
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-cream/60">
                📄
              </div>

              {/* File Info */}
              <div className="flex-1">
                <p className="text-cream font-mono text-sm">{file.name}</p>
                <p className="text-cream/50 text-xs">{file.timeAgo}</p>
              </div>

              {/* Tag */}
              <div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-full ${
                    file.tagColor || "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {file.tag}
                </span>
              </div>
            </div>

            {/* More Options */}
            <button className="text-cream/60 hover:text-cream transition ml-2">
              ⋮
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}