export type Seat = {
  number: number;
  seatType: string;
  isUserSeat?: boolean;
};

export default function SeatMap({ seats }: { seats: Seat[] }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {seats.slice(0, 24).map((seat) => (
        <div
          key={seat.number}
          className={`rounded-xl border p-3 text-center text-xs ${
            seat.isUserSeat
              ? 'border-teal bg-teal/20 text-ocean'
              : 'border-ink/10 bg-white text-ink/70'
          }`}
        >
          <div className="text-sm font-semibold">{seat.number}</div>
          <div className="uppercase tracking-[0.2em]">{seat.seatType}</div>
        </div>
      ))}
    </div>
  );
}
