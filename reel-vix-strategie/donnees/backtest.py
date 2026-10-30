# Backtest du reel « Acheter quand le VIX dépasse 40 » : python3 donnees/backtest.py (depuis reel-vix-strategie/)
# Données Yahoo Finance : ^VIX, ^GSPC, ^SP500TR (S&P 500 dividendes réinvestis), clôtures quotidiennes 02/01/1990 → 29/10/2026
import json,datetime,statistics as st
def load(s):
    j=json.load(open(f'donnees/{s}.json'))['chart']['result'][0]
    return {datetime.datetime.fromtimestamp(a,datetime.UTC).strftime('%Y-%m-%d'):c for a,c in zip(j['timestamp'],j['indicators']['quote'][0]['close']) if c}
V=load('^VIX'); P=load('^SP500TR'); G=load('^GSPC')
D=sorted(set(V)&set(P)); n=len(D)
# épisodes VIX > 40 (première clôture au-dessus après 60 jours sous 40)
ep=[];last=-999
for i,d in enumerate(D):
    if V[d]>40 and i-last>120: ep.append(i)
    if V[d]>40: last=i
print('épisodes VIX>40:',[(D[i],round(V[D[i]],1)) for i in ep])
print('jours VIX>40:',sum(1 for d in D if V[d]>40),'sur',n)
def fwd(i,y):
    j=i+252*y
    return P[D[j]]/P[D[i]]-1 if j<n else None
for y in (1,3,5):
    a=[fwd(i,y) for i in ep if fwd(i,y) is not None]; b=[fwd(i,y) for i in range(n) if fwd(i,y) is not None]
    print(f'{y} an(s) après 1er jour VIX>40: moy {st.mean(a)*100:.0f}% (n={len(a)}, min {min(a)*100:.0f}%) | tous jours: moy {st.mean(b)*100:.0f}% | % positif ep {sum(x>0 for x in a)}/{len(a)}')
for i in ep:
    print(D[i], round(V[D[i]],1), *(f'{y}a:{(fwd(i,y) or float("nan"))*100:.0f}%' for y in (1,3,5)))
# Stratégie mensuelle : 100 $ par mois. A) DCA : investi chaque mois. B) attente : cash qui s'accumule, tout investi le 1er jour où VIX>40 (cash à 0 %).
months=[];prev=None
for i,d in enumerate(D):
    if d[:7]!=prev: months.append(i); prev=d[:7]
ms=set(months)
sa=0;sb=0;cash=0;inv=0
for i,d in enumerate(D):
    if i in ms:
        inv+=100; sa+=100/P[d]; cash+=100
    if V[d]>40 and cash>0:
        sb+=cash/P[d]; cash=0
end=D[-1]
print('période',D[0],'→',end,'versé',inv)
print('DCA',round(sa*P[end]),'attente VIX>40',round(sb*P[end]+cash),'cash restant',cash)
# variante : DCA + bonus (doubler la mise quand VIX>40 ? ) skip
# date du dernier VIX>40
print('dernier VIX>40', max(d for d in D if V[d]>40))
# buy and hold lump sum 1990 vs lump at first VIX>40
for f in (0.1,0.2,0.3):
    s=0;cash=0
    for i,d in enumerate(D):
        if i in ms: s+=100*(1-f)/P[d]; cash+=100*f
        if V[d]>40 and cash>0: s+=cash/P[d]; cash=0
    print('mixte',f,round(s*P[end]+cash))
# sans dividendes (indice prix) pour info
sa=0;sb=0;cash=0
for i,d in enumerate(D):
    if i in ms: sa+=100/G[d]; cash+=100
    if V[d]>40 and cash>0: sb+=cash/G[d]; cash=0
print('prix seul DCA',round(sa*G[end]),'attente',round(sb*G[end]+cash))
# moyenne 1 an hors épisodes : fréquence
print('max VIX', max(V.values()), max(V,key=V.get))
