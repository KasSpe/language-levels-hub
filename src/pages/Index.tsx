const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Grammatica Overzicht</h1>
      <div className="grid grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20">
          Grammaticaal doel
        </div>
        <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20 text-center">
          A1
        </div>
        <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20 text-center">
          A2
        </div>
        <div className="bg-primary text-primary-foreground font-semibold p-4 text-center">
          B1
        </div>

        {/* Empty rows for content */}
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <>
            <div key={`goal-${rowIndex}`} className="p-4 border-t border-r border-border bg-muted/30">
              &nbsp;
            </div>
            <div key={`a1-${rowIndex}`} className="p-4 border-t border-r border-border">
              &nbsp;
            </div>
            <div key={`a2-${rowIndex}`} className="p-4 border-t border-r border-border">
              &nbsp;
            </div>
            <div key={`b1-${rowIndex}`} className="p-4 border-t border-border">
              &nbsp;
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Index;
