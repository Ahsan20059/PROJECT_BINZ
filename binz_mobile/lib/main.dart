import 'package:flutter/material.dart';
import 'account_session.dart';
import 'auth_page.dart';

void main() => runApp(BinZApp());

const pine = Color(0xFF174E2A);
const teal = Color(0xFF0B7C77);
const cream = Color(0xFFFBFAF2);
const mint = Color(0xFFEAF4E6);
const ink = Color(0xFF1F3327);

class BinZApp extends StatefulWidget {
  const BinZApp({super.key});
  @override
  State<BinZApp> createState() => _BinZAppState();
}

class _BinZAppState extends State<BinZApp> {
  final session = AccountSession();

  @override
  void initState() {
    super.initState();
    session.restore();
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'BinZ',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: cream,
          colorScheme: ColorScheme.fromSeed(seedColor: pine, surface: cream),
          appBarTheme:
              const AppBarTheme(backgroundColor: cream, foregroundColor: ink),
          textTheme: ThemeData.light()
              .textTheme
              .apply(bodyColor: ink, displayColor: pine),
        ),
        home: AnimatedBuilder(
            animation: session,
            builder: (_, __) {
              if (!session.ready) {
                return const Scaffold(
                    body: Center(child: CircularProgressIndicator()));
              }
              return session.signedIn
                  ? Shell(session: session)
                  : AuthPage(session: session);
            }),
      );
}

class Shell extends StatefulWidget {
  final AccountSession session;
  const Shell({super.key, required this.session});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  int tab = 0;
  final labels = const ['Home', 'Scrap', 'Earn', 'Impact', 'Service'];
  final icons = const [
    Icons.home_outlined,
    Icons.recycling_outlined,
    Icons.auto_awesome_outlined,
    Icons.insights_outlined,
    Icons.support_agent_outlined
  ];

  void openBasket() => Navigator.of(context)
      .push(MaterialPageRoute(builder: (_) => const BasketPage()));

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Stack(children: [
          IndexedStack(index: tab, children: [
            const HomePage(),
            const ScrapPage(),
            const EarnPage(),
            const ImpactPage(),
            ServicePage(session: widget.session)
          ]),
          Positioned(
            left: 16,
            right: 16,
            bottom: 14,
            child: SafeArea(
                top: false,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .94),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(
                            color: Color(0x220E2C1A),
                            blurRadius: 16,
                            offset: Offset(0, 6))
                      ]),
                  child: Row(
                      children: List.generate(
                          5,
                          (i) => Expanded(
                                  child: InkWell(
                                borderRadius: BorderRadius.circular(20),
                                onTap: () => setState(() => tab = i),
                                child: Padding(
                                    padding:
                                        const EdgeInsets.symmetric(vertical: 9),
                                    child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(icons[i],
                                              size: 21,
                                              color: tab == i
                                                  ? pine
                                                  : const Color(0xFF718078)),
                                          const SizedBox(height: 3),
                                          Text(labels[i],
                                              style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: tab == i
                                                      ? FontWeight.w700
                                                      : FontWeight.w500,
                                                  color: tab == i
                                                      ? pine
                                                      : const Color(
                                                          0xFF718078))),
                                        ])),
                              )))),
                )),
          ),
        ]),
      );
}

class PageFrame extends StatelessWidget {
  final String title, subtitle;
  final Widget child;
  final bool showAvatar;
  const PageFrame(
      {super.key,
      required this.title,
      required this.subtitle,
      required this.child,
      this.showAvatar = true});
  @override
  Widget build(BuildContext context) => SafeArea(
          child: Column(children: [
        Padding(
            padding: const EdgeInsets.fromLTRB(22, 16, 22, 10),
            child: Row(children: [
              const BrandMark(),
              const Spacer(),
              const CoinPill(),
              const SizedBox(width: 10),
              if (showAvatar)
                const CircleAvatar(
                    radius: 18,
                    backgroundColor: mint,
                    child: Icon(Icons.person_outline, color: pine)),
            ])),
        Expanded(
            child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 110),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title,
                          style: const TextStyle(
                              fontSize: 31,
                              height: 1,
                              letterSpacing: -1.2,
                              color: pine,
                              fontWeight: FontWeight.w800)),
                      const SizedBox(height: 7),
                      Text(subtitle,
                          style: const TextStyle(
                              color: Color(0xFF66756B), fontSize: 14)),
                      const SizedBox(height: 22),
                      child,
                    ]))),
      ]));
}

class CoinPill extends StatelessWidget {
  const CoinPill({super.key});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
        decoration:
            BoxDecoration(color: mint, borderRadius: BorderRadius.circular(20)),
        child: const Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.monetization_on_outlined, color: teal, size: 16),
          SizedBox(width: 4),
          Text('46',
              style: TextStyle(color: pine, fontWeight: FontWeight.w800)),
          SizedBox(width: 3),
          Text('Z',
              style: TextStyle(
                  color: teal, fontSize: 11, fontWeight: FontWeight.w800)),
        ]),
      );
}

class BrandMark extends StatelessWidget {
  const BrandMark({super.key});
  @override
  Widget build(BuildContext context) => Image.asset(
        'assets/binz-logo.png',
        width: 84,
        height: 36,
        fit: BoxFit.contain,
        alignment: Alignment.centerLeft,
        semanticLabel: 'BinZ',
      );
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) => PageFrame(
      title: 'Hi, Aman',
      subtitle: "Let's turn your scrap into value today.",
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        DecoratedBox(
            decoration: BoxDecoration(
                color: pine, borderRadius: BorderRadius.circular(22)),
            child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('PICKUP WINDOW TODAY',
                          style: TextStyle(
                              color: Color(0xFFB9DDC0),
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1)),
                      const SizedBox(height: 8),
                      const Text('10:00 AM – 2:00 PM',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.w800)),
                      const SizedBox(height: 5),
                      const Text('Sector 62 route',
                          style: TextStyle(color: Color(0xFFD5EAD8))),
                      const Divider(color: Color(0x3377B885), height: 26),
                      Row(children: [
                        const CircleAvatar(
                            backgroundColor: Color(0xFFDFEEDB),
                            child: Icon(Icons.person, color: pine)),
                        const SizedBox(width: 10),
                        const Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text('Rohit Kumar',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w700)),
                              Text('4.8 • 98765 43210',
                                  style: TextStyle(
                                      color: Color(0xFFD5EAD8), fontSize: 12))
                            ])),
                        IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.call_outlined,
                                color: Colors.white))
                      ])
                    ]))),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(
              child: ActionTile(
                  icon: Icons.calendar_month_outlined,
                  label: 'Schedule pickup',
                  onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const BasketPage())))),
          const SizedBox(width: 10),
          Expanded(
              child: ActionTile(
                  icon: Icons.sell_outlined,
                  label: 'Rates',
                  onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const RatesPage())))),
          const SizedBox(width: 10),
          Expanded(
              child: ActionTile(
                  icon: Icons.memory_outlined,
                  label: 'E-waste',
                  onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const EWastePage()))))
        ]),
        const SizedBox(height: 22),
        const Text('Pickup status',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 12),
        const StatusSteps(),
        const SizedBox(height: 18),
        InkWell(
            onTap: () {},
            child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                    color: mint, borderRadius: BorderRadius.circular(18)),
                child: const Row(children: [
                  Icon(Icons.eco_outlined, color: teal),
                  SizedBox(width: 12),
                  Expanded(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        Text('336.3 kg',
                            style: TextStyle(
                                fontSize: 21,
                                fontWeight: FontWeight.w800,
                                color: pine)),
                        Text('CO₂ saved to date',
                            style: TextStyle(color: Color(0xFF597064)))
                      ])),
                  Icon(Icons.arrow_outward, color: pine)
                ]))),
      ]));
}

class ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const ActionTile(
      {super.key,
      required this.icon,
      required this.label,
      required this.onTap});
  @override
  Widget build(BuildContext c) => InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Container(
          height: 92,
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(15)),
          padding: const EdgeInsets.all(12),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(icon, color: pine),
            const Spacer(),
            Text(label,
                style:
                    const TextStyle(fontSize: 11, fontWeight: FontWeight.w700))
          ])));
}

class StatusSteps extends StatelessWidget {
  const StatusSteps({super.key});
  @override
  Widget build(BuildContext c) => Row(children: const [
        StepDot(label: 'Booked', active: true),
        Expanded(child: Divider(color: Color(0xFF9DC9A1))),
        StepDot(label: 'Assigned', active: true),
        Expanded(child: Divider(color: Color(0xFFD5DED6))),
        StepDot(label: 'Pending')
      ]);
}

class StepDot extends StatelessWidget {
  final String label;
  final bool active;
  const StepDot({super.key, required this.label, this.active = false});
  @override
  Widget build(BuildContext c) => Column(children: [
        Icon(active ? Icons.check_circle : Icons.circle_outlined,
            size: 18, color: active ? teal : const Color(0xFFABB8AE)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 10))
      ]);
}

class ScrapPage extends StatelessWidget {
  const ScrapPage({super.key});
  @override
  Widget build(BuildContext context) => PageFrame(
      title: 'Sell your scrap',
      subtitle: 'Scan items or choose from today’s rates.',
      child: Column(children: [
        InkWell(
            onTap: () => _scanSheet(context),
            child: Container(
                width: double.infinity,
                height: 148,
                decoration: BoxDecoration(
                    color: mint,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: const Color(0xFFBCD7BB))),
                child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.document_scanner_outlined,
                          color: teal, size: 38),
                      SizedBox(height: 10),
                      Text('Scan or upload your scrap',
                          style: TextStyle(
                              fontWeight: FontWeight.w800, color: pine)),
                      SizedBox(height: 4),
                      Text('Our AI will identify it for you',
                          style:
                              TextStyle(color: Color(0xFF617568), fontSize: 12))
                    ]))),
        const SizedBox(height: 22),
        const Align(
            alignment: Alignment.centerLeft,
            child: Text('Today’s rates',
                style: TextStyle(
                    fontSize: 19, color: pine, fontWeight: FontWeight.w800))),
        const SizedBox(height: 8),
        ...[
          'Newspaper     ₹14 / kg',
          'Cardboard     ₹10 / kg',
          'Plastic       ₹18 / kg',
          'Copper        ₹520 / kg',
          'E-waste       ₹75 / kg'
        ].map((x) => ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.check_box_outline_blank, color: teal),
            title: Text(x.split('     ').first,
                style: const TextStyle(fontWeight: FontWeight.w700)),
            trailing: Text(x.split('     ').last,
                style:
                    const TextStyle(color: teal, fontWeight: FontWeight.w700)),
            subtitle: const Text('Price may vary by condition')))
      ]));
}

void _scanSheet(BuildContext context) => showModalBottomSheet(
      context: context,
      backgroundColor: cream,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(26),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.center_focus_strong_outlined, color: teal, size: 44),
          const SizedBox(height: 12),
          const Text('Identify your scrap',
              style: TextStyle(
                  fontSize: 22, fontWeight: FontWeight.w800, color: pine)),
          const SizedBox(height: 8),
          const Text('Take a photo or select one from your gallery.',
              textAlign: TextAlign.center),
          const SizedBox(height: 22),
          FilledButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text('Open camera')),
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Choose a photo')),
        ]),
      ),
    );

class EarnPage extends StatelessWidget {
  const EarnPage({super.key});
  @override
  Widget build(BuildContext context) => PageFrame(
      title: 'Earn rewards',
      subtitle: 'Small actions add up to a cleaner city.',
      child: Column(children: [
        Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [teal, pine]),
                borderRadius: BorderRadius.circular(23)),
            child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Z-WALLET',
                      style: TextStyle(
                          color: Color(0xFFD5EAD8),
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1)),
                  SizedBox(height: 10),
                  Text('46 Z-Coins',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 31,
                          fontWeight: FontWeight.w800)),
                  SizedBox(height: 18),
                  LinearProgressIndicator(
                      value: .62,
                      color: Color(0xFFC5E8B9),
                      backgroundColor: Color(0x447CE097)),
                  SizedBox(height: 8),
                  Text('14 coins to your next reward',
                      style: TextStyle(color: Color(0xFFD5EAD8)))
                ])),
        const SizedBox(height: 24),
        const Align(
            alignment: Alignment.centerLeft,
            child: Text('Ways to earn',
                style: TextStyle(
                    fontSize: 19, fontWeight: FontWeight.w800, color: pine))),
        const SizedBox(height: 8),
        ...[
          ('Complete a pickup', '+10'),
          ('Upload recycling proof', '+5'),
          ('Refer a neighbour', '+20')
        ].map((e) => Card(
            child: ListTile(
                leading: const Icon(Icons.bolt_outlined, color: teal),
                title: Text(e.$1,
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                trailing: Text(e.$2,
                    style: const TextStyle(
                        color: teal, fontWeight: FontWeight.w800))))),
        const SizedBox(height: 10),
        Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
                color: mint, borderRadius: BorderRadius.circular(18)),
            child: const Row(children: [
              Icon(Icons.emoji_events_outlined, color: pine),
              SizedBox(width: 12),
              Expanded(
                  child: Text('You’re #18 in Greater Noida',
                      style: TextStyle(fontWeight: FontWeight.w700)))
            ]))
      ]));
}

class ImpactPage extends StatelessWidget {
  const ImpactPage({super.key});

  @override
  Widget build(BuildContext context) => PageFrame(
        title: 'Your impact',
        subtitle: 'Every item gets a second life.',
        child: Column(children: [
          const Text('336.3',
              style: TextStyle(
                  fontSize: 62,
                  fontWeight: FontWeight.w900,
                  color: pine,
                  letterSpacing: -2)),
          const Text('kg CO₂ prevented',
              style: TextStyle(
                  color: teal, fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 26),
          Container(
            height: 190,
            width: 190,
            decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: SweepGradient(
                    colors: [teal, teal, Color(0xFFC8DEC8), Color(0xFFC8DEC8)],
                    stops: [0, .68, .681, 1])),
            child: Center(
              child: Container(
                height: 128,
                width: 128,
                decoration:
                    const BoxDecoration(color: cream, shape: BoxShape.circle),
                child: const Center(
                    child: Text('68%\nsolid waste',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontWeight: FontWeight.w800, color: pine))),
              ),
            ),
          ),
          const SizedBox(height: 25),
          const Row(children: [
            Expanded(
                child: ImpactStat(value: '142 kg', label: 'scrap recycled')),
            SizedBox(width: 12),
            Expanded(child: ImpactStat(value: '19', label: 'e-waste items'))
          ]),
          const SizedBox(height: 22),
          ListTile(
              tileColor: mint,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              leading: const Icon(Icons.verified_user_outlined, color: teal),
              title: const Text('Verified e-waste ticket',
                  style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: const Text('BW-2026-0142 • Data erased'),
              trailing: const Icon(Icons.chevron_right)),
        ]),
      );
}

class ImpactStat extends StatelessWidget {
  final String value, label;
  const ImpactStat({super.key, required this.value, required this.label});
  @override
  Widget build(BuildContext c) => Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(value,
            style: const TextStyle(
                fontSize: 20, fontWeight: FontWeight.w800, color: pine)),
        Text(label,
            style: const TextStyle(fontSize: 12, color: Color(0xFF6A7C70)))
      ]));
}

class RatesPage extends StatefulWidget {
  const RatesPage({super.key});

  @override
  State<RatesPage> createState() => _RatesPageState();
}

class _RatesPageState extends State<RatesPage> {
  String category = 'Recyclables';
  final rateGroups = const {
    'Recyclables': [
      (
        'Newspaper',
        '₹14/kg',
        'Paper recovery for newspapers and magazines.',
        Icons.newspaper_outlined
      ),
      (
        'Glass bottles',
        '₹2/kg',
        'Accepted with your mixed scrap pickup.',
        Icons.wine_bar_outlined
      ),
      (
        'Copies / books',
        '₹12/kg',
        'Books and notebooks for paper recovery.',
        Icons.menu_book_outlined
      ),
      (
        'PET bottles',
        '₹8/kg',
        'Clean bottles and containers.',
        Icons.local_drink_outlined
      ),
      (
        'Iron',
        '₹26/kg',
        'Bulk quote available for heavy items.',
        Icons.hardware_outlined
      ),
      (
        'Steel',
        '₹40/kg',
        'Utensils, frames and small steel scrap.',
        Icons.kitchen_outlined
      ),
      (
        'Aluminium',
        '₹105/kg',
        'Cans, frames and clean aluminium.',
        Icons.inventory_2_outlined
      ),
      (
        'Copper wire',
        '₹650/kg',
        'Higher value depends on quality.',
        Icons.cable_outlined
      ),
      (
        'Cardboard',
        '₹8/kg',
        'Flattened boxes and packaging.',
        Icons.all_inbox_outlined
      ),
    ],
    'Appliances': [
      (
        'Washing machine',
        'Quote',
        'Schedule an inspection for pickup value.',
        Icons.local_laundry_service_outlined
      ),
      (
        'Refrigerator',
        'Quote',
        'Condition-based rate and safe handling.',
        Icons.kitchen_outlined
      ),
      (
        'Air conditioner',
        'Quote',
        'Get a safe, responsible collection quote.',
        Icons.ac_unit_outlined
      ),
    ],
  };

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Scrap rates'), actions: const [
          Padding(padding: EdgeInsets.only(right: 16), child: CoinPill())
        ]),
        body: ListView(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
            children: [
              const Text('Clear rates, before pickup',
                  style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: pine,
                      letterSpacing: -1.2)),
              const SizedBox(height: 7),
              const Text(
                  'Rates are estimates and may vary by condition and quantity.',
                  style: TextStyle(color: Color(0xFF66756B))),
              const SizedBox(height: 18),
              SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                      children: ['Recyclables', 'Appliances']
                          .map((item) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                  label: Text(item),
                                  selected: category == item,
                                  onSelected: (_) =>
                                      setState(() => category = item))))
                          .toList())),
              const SizedBox(height: 12),
              ...rateGroups[category]!.map((item) => RateCard(
                  name: item.$1, rate: item.$2, note: item.$3, icon: item.$4)),
              const SizedBox(height: 10),
              InkWell(
                  onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const EWastePage())),
                  child: Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                          color: mint, borderRadius: BorderRadius.circular(18)),
                      child: const Row(children: [
                        Icon(Icons.memory_outlined, color: teal),
                        SizedBox(width: 12),
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text('Have e-waste?',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      color: pine)),
                              Text(
                                  'Raise a secure disposal ticket for devices.')
                            ])),
                        Icon(Icons.chevron_right, color: pine)
                      ]))),
            ]),
      );
}

class RateCard extends StatelessWidget {
  final String name, rate, note;
  final IconData icon;
  const RateCard(
      {super.key,
      required this.name,
      required this.rate,
      required this.note,
      required this.icon});

  @override
  Widget build(BuildContext context) => Card(
      child: Padding(
          padding: const EdgeInsets.all(15),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
                padding: const EdgeInsets.all(10),
                decoration:
                    const BoxDecoration(color: mint, shape: BoxShape.circle),
                child: Icon(icon, color: pine)),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(name,
                      style: const TextStyle(
                          fontWeight: FontWeight.w800, color: pine)),
                  const SizedBox(height: 4),
                  Text(note,
                      style: const TextStyle(
                          fontSize: 12, color: Color(0xFF66756B)))
                ])),
            const SizedBox(width: 8),
            Text(rate,
                style:
                    const TextStyle(color: teal, fontWeight: FontWeight.w800))
          ])));
}

class EWastePage extends StatefulWidget {
  const EWastePage({super.key});

  @override
  State<EWastePage> createState() => _EWastePageState();
}

class _EWastePageState extends State<EWastePage> {
  final tickets = <(String, String, String, IconData)>[
    (
      'EW-840261',
      'Laptop',
      'Pickup scheduled • 16 Sep',
      Icons.laptop_mac_outlined
    ),
    (
      'EW-839890',
      'Samsung Galaxy A52',
      'Data erased • Certificate ready',
      Icons.phone_android_outlined
    ),
  ];

  void addTicket() => showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: cream,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(26))),
        builder: (sheetContext) => Padding(
          padding: EdgeInsets.fromLTRB(
              24, 24, 24, 24 + MediaQuery.of(sheetContext).viewInsets.bottom),
          child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Raise an e-waste ticket',
                    style: TextStyle(
                        fontSize: 23,
                        fontWeight: FontWeight.w800,
                        color: pine)),
                const SizedBox(height: 6),
                const Text(
                    'We will route your device for safe, responsible processing.'),
                const SizedBox(height: 18),
                const TextField(
                    decoration: InputDecoration(
                        labelText: 'Device type',
                        border: OutlineInputBorder())),
                const SizedBox(height: 12),
                const TextField(
                    maxLines: 2,
                    decoration: InputDecoration(
                        labelText: 'Device details',
                        border: OutlineInputBorder())),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () {
                      setState(() => tickets.insert(0, (
                            'EW-840314',
                            'New e-waste item',
                            'Ticket raised • Awaiting pickup',
                            Icons.memory_outlined
                          )));
                      Navigator.pop(sheetContext);
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                          content: Text('E-waste ticket raised • +3 Z-Coins')));
                    },
                    child: const Text('Raise ticket'),
                  ),
                ),
              ]),
        ),
      );

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('E-waste care'), actions: const [
        Padding(padding: EdgeInsets.only(right: 16), child: CoinPill())
      ]),
      floatingActionButton: FloatingActionButton.extended(
          onPressed: addTicket,
          icon: const Icon(Icons.add),
          label: const Text('Raise ticket')),
      body: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 90),
          children: [
            Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                    color: pine, borderRadius: BorderRadius.circular(22)),
                child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.verified_user_outlined,
                          color: Color(0xFFC6E8C9)),
                      SizedBox(height: 12),
                      Text('Responsible device recycling',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.w800)),
                      SizedBox(height: 5),
                      Text(
                          'Phones, laptops, batteries and more are collected separately and securely.',
                          style: TextStyle(color: Color(0xFFD5EAD8)))
                    ])),
            const SizedBox(height: 24),
            const Text('Your e-waste tickets',
                style: TextStyle(
                    fontSize: 19, color: pine, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            ...tickets.map((ticket) => Card(
                child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                            color: mint, shape: BoxShape.circle),
                        child: Icon(ticket.$4, color: teal)),
                    title: Text(ticket.$2,
                        style: const TextStyle(fontWeight: FontWeight.w800)),
                    subtitle: Text('${ticket.$1} • ${ticket.$3}'),
                    trailing: const Icon(Icons.chevron_right)))),
            const SizedBox(height: 14),
            const Text('Accepted items',
                style: TextStyle(
                    fontSize: 19, color: pine, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            const Wrap(spacing: 8, runSpacing: 8, children: [
              Chip(label: Text('Phones')),
              Chip(label: Text('Laptops')),
              Chip(label: Text('Batteries')),
              Chip(label: Text('Cables')),
              Chip(label: Text('Tablets'))
            ])
          ]));
}

class FaqPage extends StatelessWidget {
  const FaqPage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Frequently asked questions')),
      body: ListView(padding: const EdgeInsets.all(20), children: [
        const Text('How can we help?',
            style: TextStyle(
                fontSize: 28, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 8),
        const Text('Quick answers about pickup, rewards and recycling.'),
        const SizedBox(height: 18),
        ...const [
          (
            'How do I book a pickup?',
            'Add scrap to your basket, choose a date and a time slot, then confirm your pickup.'
          ),
          (
            'When will I get paid?',
            'Your collector verifies the weight and condition at pickup; the final value is then confirmed.'
          ),
          (
            'How do Z-Coins work?',
            'You earn Z-Coins for verified recycling actions, including e-waste tickets and cleanup proof.'
          ),
          (
            'What happens to e-waste?',
            'Devices are processed through a separate, responsible recycling route. Eligible devices can receive a data-erasure certificate.'
          ),
          (
            'Can I change a pickup slot?',
            'Yes. Open the pickup ticket before the collector is assigned and choose another available slot.'
          )
        ].map((item) => Card(
                child: ExpansionTile(
                    title: Text(item.$1,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    children: [
                  Text(item.$2,
                      style: const TextStyle(color: Color(0xFF596B60)))
                ])))
      ]));
}

class AdminDashboardPage extends StatefulWidget {
  final AccountSession session;
  const AdminDashboardPage({super.key, required this.session});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  int tab = 0;
  bool online = true;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _AdminHome(
          online: online,
          onOnlineChanged: (value) => setState(() => online = value),
          onTabChanged: (value) => setState(() => tab = value)),
      AdminOrdersPage(onTabChanged: (value) => setState(() => tab = value)),
      AdminUpdatesPage(onTabChanged: (value) => setState(() => tab = value)),
      AdminProfilePage(
          account: widget.session.account!,
          online: online,
          onSignOut: widget.session.signOut,
          onTabChanged: (value) => setState(() => tab = value)),
    ];
    return pages[tab];
  }
}

class _AdminHome extends StatelessWidget {
  final bool online;
  final ValueChanged<bool> onOnlineChanged;
  final ValueChanged<int> onTabChanged;
  const _AdminHome(
      {required this.online,
      required this.onOnlineChanged,
      required this.onTabChanged});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFF5F0E8),
        body: SafeArea(
            child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 104),
                children: [
              Row(children: [
                const BrandMark(),
                const Spacer(),
                IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_none_rounded,
                        color: Color(0xFF2B5329))),
                const CircleAvatar(
                    radius: 18,
                    backgroundColor: Color(0xFFE5E9DD),
                    child: Icon(Icons.person_outline, color: Color(0xFF2B5329)))
              ]),
              const SizedBox(height: 18),
              const Text('Good morning, Aman',
                  style: TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF2B5329),
                      letterSpacing: -1)),
              const SizedBox(height: 4),
              const Text('Ready to make an impact today?',
                  style: TextStyle(color: Color(0xFF6E756B))),
              const SizedBox(height: 18),
              Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                      color: const Color(0xFF2B5329),
                      borderRadius: BorderRadius.circular(22)),
                  child: Row(children: [
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          Text('ON DUTY',
                              style: TextStyle(
                                  color: Color(0xFFBCD2B7),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1)),
                          SizedBox(height: 8),
                          Text(online ? 'You’re online' : 'You’re offline',
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w800)),
                          SizedBox(height: 5),
                          Text(
                              online
                                  ? '3 pickups assigned for today'
                                  : 'Go online to receive pickups',
                              style: const TextStyle(color: Color(0xFFDCE8D8)))
                        ])),
                    Switch(
                        value: online,
                        onChanged: onOnlineChanged,
                        activeThumbColor: const Color(0xFFB8DB8F))
                  ])),
              const SizedBox(height: 16),
              GridView.count(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.62,
                children: [
                  AdminStat(value: '03', label: 'TOTAL'),
                  AdminStat(value: '01', label: 'DONE'),
                  AdminStat(value: '02', label: 'PENDING'),
                  AdminStat(value: '₹420', label: 'EARNINGS'),
                ],
              ),
              const SizedBox(height: 26),
              Row(children: [
                const Expanded(
                    child: Text('Today’s pickups',
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF2B5329)))),
                TextButton(
                    onPressed: () => onTabChanged(1),
                    child: const Text('View all'))
              ]),
              const SizedBox(height: 4),
              AdminPickupCard(
                  number: '01',
                  name: 'Aman Bhutani',
                  location: 'Sector 62, Greater Noida',
                  time: '10:00 AM – 12:00 PM',
                  status: 'NEXT PICKUP',
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(
                      builder: (_) => const AdminPickupDetailsPage()))),
              const SizedBox(height: 10),
              const AdminPickupCard(
                  number: '02',
                  name: 'Priya Sharma',
                  location: 'Alpha 1, Greater Noida',
                  time: '12:00 PM – 2:00 PM',
                  status: 'UP NEXT'),
              const SizedBox(height: 10),
              const AdminPickupCard(
                  number: '03',
                  name: 'Vikram Singh',
                  location: 'Noida Extension',
                  time: '2:00 PM – 4:00 PM',
                  status: 'UP NEXT'),
            ])),
        floatingActionButton: FloatingActionButton.extended(
            backgroundColor: const Color(0xFF2B5329),
            foregroundColor: Colors.white,
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('QR scanner ready'))),
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('Scan QR')),
        bottomNavigationBar: AdminBottomNav(
            selectedIndex: 0, onDestinationSelected: onTabChanged),
      );
}

class AdminBottomNav extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;
  const AdminBottomNav(
      {super.key,
      required this.selectedIndex,
      required this.onDestinationSelected});
  @override
  Widget build(BuildContext context) => NavigationBar(
          selectedIndex: selectedIndex,
          onDestinationSelected: onDestinationSelected,
          destinations: const [
            NavigationDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home),
                label: 'Home'),
            NavigationDestination(
                icon: Icon(Icons.list_alt_outlined), label: 'Orders'),
            NavigationDestination(
                icon: Icon(Icons.notifications_none), label: 'Updates'),
            NavigationDestination(
                icon: Icon(Icons.person_outline), label: 'Profile'),
          ]);
}

class AdminOrdersPage extends StatefulWidget {
  final ValueChanged<int> onTabChanged;
  const AdminOrdersPage({super.key, required this.onTabChanged});
  @override
  State<AdminOrdersPage> createState() => _AdminOrdersPageState();
}

class _AdminOrdersPageState extends State<AdminOrdersPage> {
  String filter = 'All';
  final orders = const [
    ('Aman Bhutani', 'Sector 62 • 10:00 AM – 12:00 PM', 'In progress', '01'),
    ('Priya Sharma', 'Alpha 1 • 12:00 PM – 2:00 PM', 'Pending', '02'),
    ('Vikram Singh', 'Noida Extension • 2:00 PM – 4:00 PM', 'Pending', '03'),
    ('Neha Kapoor', 'Gaur City • Completed at 9:20 AM', 'Completed', '04'),
  ];

  @override
  Widget build(BuildContext context) {
    final visible = filter == 'All'
        ? orders
        : orders.where((order) => order.$3 == filter).toList();
    return Scaffold(
        backgroundColor: const Color(0xFFF5F0E8),
        body: SafeArea(
            child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 100),
                children: [
              const Text('Orders',
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF2B5329))),
              const SizedBox(height: 5),
              const Text('Manage your assigned pickups.',
                  style: TextStyle(color: Color(0xFF6E756B))),
              const SizedBox(height: 18),
              SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                      children: ['All', 'Pending', 'In progress', 'Completed']
                          .map((item) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                  label: Text(item == 'All'
                                      ? 'All (${orders.length})'
                                      : '$item (${orders.where((order) => order.$3 == item).length})'),
                                  selected: filter == item,
                                  onSelected: (_) =>
                                      setState(() => filter = item))))
                          .toList())),
              const SizedBox(height: 16),
              ...visible.map((order) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: AdminPickupCard(
                      number: order.$4,
                      name: order.$1,
                      location: order.$2,
                      time: order.$3,
                      status: order.$3.toUpperCase(),
                      onTap: () => Navigator.of(context).push(MaterialPageRoute(
                          builder: (_) => const AdminPickupDetailsPage()))))),
              if (visible.isEmpty)
                const Padding(
                    padding: EdgeInsets.only(top: 38),
                    child: Center(child: Text('No pickups in this group.'))),
            ])),
        bottomNavigationBar: AdminBottomNav(
            selectedIndex: 1, onDestinationSelected: widget.onTabChanged));
  }
}

class AdminUpdatesPage extends StatefulWidget {
  final ValueChanged<int> onTabChanged;
  const AdminUpdatesPage({super.key, required this.onTabChanged});
  @override
  State<AdminUpdatesPage> createState() => _AdminUpdatesPageState();
}

class _AdminUpdatesPageState extends State<AdminUpdatesPage> {
  final read = <int>{};
  final updates = const [
    (
      'New pickup assigned',
      'Aman Bhutani • Sector 62 • 10:00 AM – 12:00 PM',
      Icons.local_shipping_outlined
    ),
    (
      'E-waste ticket approved',
      'EW-840261 is ready for secure collection.',
      Icons.memory_outlined
    ),
    (
      'Payout completed',
      '₹180 was sent for Neha Kapoor’s pickup.',
      Icons.payments_outlined
    ),
    (
      'Route reminder',
      'Your next pickup begins in 45 minutes.',
      Icons.route_outlined
    ),
  ];
  @override
  Widget build(BuildContext context) => Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
          child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 100),
              children: [
            Row(children: [
              const Expanded(
                  child: Text('Updates',
                      style: TextStyle(
                          fontSize: 29,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF2B5329)))),
              TextButton(
                  onPressed: () => setState(() =>
                      read.addAll(List.generate(updates.length, (i) => i))),
                  child: const Text('Mark all read'))
            ]),
            const Text('Stay on top of your pickup activity.',
                style: TextStyle(color: Color(0xFF6E756B))),
            const SizedBox(height: 18),
            ...List.generate(updates.length, (index) {
              final update = updates[index];
              final isRead = read.contains(index);
              return Card(
                  color: isRead
                      ? Colors.white.withValues(alpha: .7)
                      : Colors.white,
                  child: ListTile(
                      onTap: () => setState(() => read.add(index)),
                      contentPadding: const EdgeInsets.all(14),
                      leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                              color: const Color(0xFF2B5329)
                                  .withValues(alpha: .10),
                              shape: BoxShape.circle),
                          child:
                              Icon(update.$3, color: const Color(0xFF2B5329))),
                      title: Text(update.$1,
                          style: TextStyle(
                              fontWeight:
                                  isRead ? FontWeight.w500 : FontWeight.w800,
                              color: const Color(0xFF2B5329))),
                      subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(update.$2)),
                      trailing: isRead
                          ? null
                          : const Icon(Icons.circle,
                              color: Color(0xFFB46C1D), size: 10)));
            }),
          ])),
      bottomNavigationBar: AdminBottomNav(
          selectedIndex: 2, onDestinationSelected: widget.onTabChanged));
}

class AdminProfilePage extends StatelessWidget {
  final Account account;
  final bool online;
  final Future<void> Function() onSignOut;
  final ValueChanged<int> onTabChanged;
  const AdminProfilePage(
      {super.key,
      required this.account,
      required this.online,
      required this.onSignOut,
      required this.onTabChanged});
  @override
  Widget build(BuildContext context) => Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
          child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 100),
              children: [
            const Center(
                child: CircleAvatar(
                    radius: 38,
                    backgroundColor: Color(0xFFE4EEDF),
                    child: Icon(Icons.person_outline,
                        size: 39, color: Color(0xFF2B5329)))),
            const SizedBox(height: 12),
            Center(
                child: Text('${account.firstName} ${account.lastName}'.trim(),
                    style: const TextStyle(
                        fontSize: 23,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF2B5329)))),
            const SizedBox(height: 3),
            Center(
                child: Text('Pickup partner • ${account.state}',
                    style: const TextStyle(color: Color(0xFF6E756B)))),
            const SizedBox(height: 24),
            InkWell(
                onTap: () => onTabChanged(0),
                borderRadius: BorderRadius.circular(18),
                child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                        color: const Color(0xFF2B5329),
                        borderRadius: BorderRadius.circular(18)),
                    child: Row(children: [
                      const Icon(Icons.power_settings_new,
                          color: Color(0xFFB8DB8F)),
                      const SizedBox(width: 12),
                      Expanded(
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                            const Text('Duty status',
                                style: TextStyle(
                                    color: Color(0xFFDCE8D8), fontSize: 12)),
                            Text(
                                online
                                    ? 'Online and receiving pickups'
                                    : 'Offline',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w800))
                          ])),
                      const Icon(Icons.chevron_right, color: Colors.white)
                    ]))),
            const SizedBox(height: 24),
            const Text('Account',
                style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF2B5329))),
            const SizedBox(height: 8),
            ...[
              ('My earnings', Icons.account_balance_wallet_outlined),
              ('Pickup history', Icons.history_outlined),
              ('Support & FAQs', Icons.help_outline),
              ('Settings', Icons.settings_outlined)
            ].map((item) => Card(
                child: ListTile(
                    onTap: () => _openProfileItem(context, item.$1),
                    leading: Icon(item.$2, color: const Color(0xFF2B5329)),
                    title: Text(item.$1,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    trailing: const Icon(Icons.chevron_right)))),
            const SizedBox(height: 12),
            OutlinedButton.icon(
                onPressed: onSignOut,
                icon: const Icon(Icons.logout),
                label: const Text('Sign out')),
          ])),
      bottomNavigationBar: AdminBottomNav(
          selectedIndex: 3, onDestinationSelected: onTabChanged));
}

void _openProfileItem(BuildContext context, String title) {
  if (title == 'Support & FAQs') {
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => const FaqPage()));
    return;
  }
  Navigator.of(context)
      .push(MaterialPageRoute(builder: (_) => AccountDetailPage(title: title)));
}

class AccountDetailPage extends StatelessWidget {
  final String title;
  const AccountDetailPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
          child: Text(
              '$title will appear here as account activity is recorded.',
              textAlign: TextAlign.center)));
}

class AdminStat extends StatelessWidget {
  final String value, label;
  const AdminStat({super.key, required this.value, required this.label});
  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(value,
                style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF2B5329))),
            const SizedBox(height: 2),
            Text(label,
                style: const TextStyle(
                    fontSize: 10,
                    letterSpacing: .7,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF788276)))
          ]));
}

class AdminPickupCard extends StatelessWidget {
  final String number, name, location, time, status;
  final VoidCallback? onTap;
  const AdminPickupCard(
      {super.key,
      required this.number,
      required this.name,
      required this.location,
      required this.time,
      required this.status,
      this.onTap});
  @override
  Widget build(BuildContext context) => InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(18)),
          child: Row(children: [
            Container(
                width: 35,
                height: 35,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                    color: Color(0xFFE4EEDF), shape: BoxShape.circle),
                child: Text(number,
                    style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF2B5329)))),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(name,
                      style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF2B5329))),
                  const SizedBox(height: 3),
                  Text(location,
                      style: const TextStyle(
                          fontSize: 12, color: Color(0xFF6E756B))),
                  const SizedBox(height: 5),
                  Text(time,
                      style: const TextStyle(
                          fontSize: 12, fontWeight: FontWeight.w700))
                ])),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(status,
                  style: const TextStyle(
                      fontSize: 9,
                      color: Color(0xFF2B5329),
                      fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              const Icon(Icons.chevron_right, color: Color(0xFF2B5329))
            ])
          ])));
}

class AdminPickupDetailsPage extends StatelessWidget {
  const AdminPickupDetailsPage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      appBar: AppBar(
          backgroundColor: const Color(0xFFF5F0E8),
          title: const Text('Pickup details')),
      body: ListView(padding: const EdgeInsets.all(20), children: [
        Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
                color: const Color(0xFF2B5329),
                borderRadius: BorderRadius.circular(20)),
            child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AMAN BHUTANI',
                      style: TextStyle(
                          color: Color(0xFFBCD2B7),
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1)),
                  SizedBox(height: 8),
                  Text('Sector 62, Greater Noida',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 21,
                          fontWeight: FontWeight.w800)),
                  SizedBox(height: 5),
                  Text('Tower B • Flat 802',
                      style: TextStyle(color: Color(0xFFDCE8D8)))
                ])),
        const SizedBox(height: 20),
        ...const [
          ('Material', 'Newspaper, cardboard & plastic'),
          ('Estimated weight', '8.5 kg'),
          ('Pickup window', '10:00 AM – 12:00 PM'),
          ('Estimated payout', '₹240')
        ].map((row) => ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(row.$1,
                style: TextStyle(color: Color(0xFF6E756B), fontSize: 12)),
            subtitle: Text(row.$2,
                style: TextStyle(
                    color: Color(0xFF2B5329),
                    fontWeight: FontWeight.w800,
                    fontSize: 16)))),
        const SizedBox(height: 12),
        const Text('Instructions',
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF2B5329))),
        const SizedBox(height: 6),
        const Text(
            'Please call at the gate. Materials will be kept near the lobby.'),
        const SizedBox(height: 22),
        FilledButton.icon(
            style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF2B5329),
                minimumSize: const Size.fromHeight(52)),
            onPressed: () => ScaffoldMessenger.of(context)
                .showSnackBar(const SnackBar(content: Text('Pickup started'))),
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text('Start pickup'))
      ]));
}

class ServicePage extends StatelessWidget {
  final AccountSession session;
  const ServicePage({super.key, required this.session});
  @override
  Widget build(BuildContext context) => PageFrame(
      title: 'Help & services',
      subtitle: 'Everything you need, in one place.',
      child: Column(children: [
        Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
                color: mint, borderRadius: BorderRadius.circular(18)),
            child: const Row(children: [
              Icon(Icons.receipt_long_outlined, color: teal),
              SizedBox(width: 12),
              Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    Text('Latest ticket',
                        style: TextStyle(
                            fontWeight: FontWeight.w800, color: pine)),
                    Text('Pickup #BZ1024 • Assigned')
                  ]))
            ])),
        const SizedBox(height: 16),
        ...[
          ('Pickup support', Icons.local_shipping_outlined),
          ('E-waste tickets', Icons.confirmation_number_outlined),
          ('Data erasure certificate', Icons.verified_user_outlined),
          if (session.isAdmin)
            ('Admin dashboard', Icons.admin_panel_settings_outlined),
          ('FAQs', Icons.help_outline),
          ('Contact us', Icons.chat_bubble_outline)
        ].map((e) => Card(
            child: ListTile(
                onTap: () {
                  if (e.$1.startsWith('Data')) {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => const CertificatePage()));
                  }
                  if (e.$1.startsWith('E-waste')) {
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const EWastePage()));
                  }
                  if (e.$1 == 'FAQs') {
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const FaqPage()));
                  }
                  if (e.$1 == 'Admin dashboard') {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => AdminDashboardPage(session: session)));
                  }
                },
                leading: Icon(e.$2, color: pine),
                title: Text(e.$1,
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                trailing: const Icon(Icons.chevron_right))))
      ]));
}

class CertificatePage extends StatelessWidget {
  const CertificatePage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Data erasure certificate')),
      body: Padding(
          padding: const EdgeInsets.all(20),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Icon(Icons.verified_user, color: teal, size: 46),
            const SizedBox(height: 16),
            const Text('Secure data erasure',
                style: TextStyle(
                    fontSize: 28, fontWeight: FontWeight.w800, color: pine)),
            const SizedBox(height: 10),
            const Text(
                'This confirms that data on your device has been securely erased.'),
            const SizedBox(height: 30),
            ...[
              'Certificate ID  BZ-ER-2026-0142',
              'Device  Samsung Galaxy A52',
              'Erased on  13 September 2026',
              'Method  NIST 800-88 Clear'
            ].map((x) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(x,
                    style: const TextStyle(fontWeight: FontWeight.w600)))),
            const Spacer(),
            SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                    onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Certificate downloaded'))),
                    icon: const Icon(Icons.download_outlined),
                    label: const Text('Download certificate')))
          ])));
}

class BasketPage extends StatefulWidget {
  const BasketPage({super.key});
  @override
  State<BasketPage> createState() => _BasketPageState();
}

class TimeSlotTile extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const TimeSlotTile(
      {super.key,
      required this.label,
      required this.selected,
      required this.onTap});

  @override
  Widget build(BuildContext context) => InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          height: 54,
          padding: const EdgeInsets.symmetric(horizontal: 15),
          decoration: BoxDecoration(
            color: selected ? mint : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
                color: selected ? teal : const Color(0xFFD9E1DA),
                width: selected ? 1.5 : 1),
          ),
          child: Row(children: [
            Icon(selected ? Icons.check_circle : Icons.schedule_outlined,
                color: selected ? teal : const Color(0xFF718078)),
            const SizedBox(width: 12),
            Text(label,
                style: TextStyle(
                    fontWeight: FontWeight.w700, color: selected ? pine : ink)),
          ]),
        ),
      );
}

class _BasketPageState extends State<BasketPage> {
  int slot = 0;
  int date = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Pickup basket')),
      body: ListView(padding: const EdgeInsets.all(20), children: [
        const Text('Your items',
            style: TextStyle(
                fontSize: 25, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 10),
        ...['Newspaper • 5 kg', 'Cardboard • 3 kg', 'E-waste • 1 item'].map(
            (x) => Card(
                child: ListTile(
                    leading: const Icon(Icons.recycling_outlined, color: teal),
                    title: Text(x),
                    trailing: const Text('Edit')))),
        const SizedBox(height: 16),
        const Text('Pickup address',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 8),
        const ListTile(
            tileColor: mint,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(16))),
            leading: Icon(Icons.location_on_outlined, color: teal),
            title: Text('Aman Bhutani'),
            subtitle: Text('Sector 62, Greater Noida')),
        const SizedBox(height: 18),
        const Text('Choose a pickup date',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 8),
        Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(
                3,
                (i) => ChoiceChip(
                    label: Text(
                        ['Today\n13 Sep', 'Tomorrow\n14 Sep', 'Mon\n15 Sep'][i],
                        textAlign: TextAlign.center),
                    selected: date == i,
                    onSelected: (_) => setState(() => date = i)))),
        const SizedBox(height: 20),
        const Text('Choose a time slot',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.w800, color: pine)),
        const SizedBox(height: 8),
        ...List.generate(
            3,
            (i) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: TimeSlotTile(
                    label: [
                      '10:00 AM – 12:00 PM',
                      '12:00 PM – 2:00 PM',
                      '2:00 PM – 4:00 PM'
                    ][i],
                    selected: slot == i,
                    onTap: () => setState(() => slot = i),
                  ),
                )),
        const SizedBox(height: 30),
        FilledButton(
            onPressed: () => showDialog(
                context: context,
                builder: (_) => AlertDialog(
                        icon: const Icon(Icons.check_circle,
                            color: teal, size: 46),
                        title: const Text('Pickup confirmed'),
                        content: const Text(
                            'Rohit will arrive during your selected window.'),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.of(context)
                                  .popUntil((r) => r.isFirst),
                              child: const Text('Done'))
                        ])),
            child: const Padding(
                padding: EdgeInsets.all(14), child: Text('Confirm pickup')))
      ]));
}
