type Props = {
  children: React.ReactNode;
};

export function StickyHeaderShell({ children }: Props) {
  return (
    <div className="sticky-header" data-hidden="false">
      {children}
    </div>
  );
}
