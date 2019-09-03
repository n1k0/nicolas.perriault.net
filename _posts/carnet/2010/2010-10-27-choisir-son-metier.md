---
title: Choisir son métier, arrêter de le (faire) subir
lang: fr
date: 2010-10-27
category: carnet
tags: humeur work collaboration webdev life
---

Je viens de finir la lecture de l'excellent billet de [Thibault](http://www.miximum.fr/), «&nbsp;[Dialogue avec un client](http://www.miximum.fr/bien-developper/525-dialogue-avec-un-client)&nbsp;». Ce billet présente point pour point ma vision de ce qu'est une collaboration efficace autour d'un projet informatique&nbsp;; je n'y apprends rien de vraiment nouveau (ayant partiellement nourri la conversation qu'il y relate), mais je suis ravi de voir que je ne suis pas le seul à partager le sentiment que la collaboration est vraiment à réinventer dans ce métier.

Ce qui me chagrine plus en revanche, c'est la lecture de certains commentaires, relativement fatalistes et désabusés&nbsp;; je ne resiste pas à la tentation d'en commenter certains.

### La métaphore du concessionnaire automobile

> Le client qui sait exactement ce qu’il veut voudra acheter son site comme une voiture.
>
> Il veut choisir les options et la peinture tout de suite et connaitre l’enveloppe budgétaire dès le début.

Nous y revoila, la fameuse métaphore du concessionnaire automobile, ça faisait longtemps. Comment comparer le développement d'un produit sur-mesures à l'achat d'un produit de type industriel&nbsp;?

<p>
  <a href="http://www.flickr.com/photos/ferdinandreus/4647740287" title="voiture">
    <img src="http://farm3.static.flickr.com/2175/2406879653_1f9fb2d592_z.jpg" alt="voiture"/>
  </a>
  <br/>
  <small><a href="http://www.flickr.com/photos/mayme/2406879653/">funny car</a>, par <a href="http://www.flickr.com/photos/mayme/">mayme</a></small>
</p>

Je peux comprendre que certains, dans notre secteur, s'emploient à minimiser les coûts de production en génériquant des sites vitrines à base de CMS — voire de frameworks surpluginisés — généralement open-source, mais quand vous avez un client qui arrive avec un *cahier-décharge* de quelques lignes du type&nbsp;:

> Mâcon, le 27 juin,
>
> Monsieur,
>
> Veuillez trouver ci-après notre cahier des charges pour notre projet d'application Internet&nbsp;:
>
> * Un réseau social orienté vente de clous rouillés online, sans oublier les groupes géolocalisés d'amateurs et de collectionneurs
> * Une place de marché permettant d'échanger des clous rouillés, avec des graphiques permettant de suivre les enchères en temps réel
> * Fournir un extranet fournisseurs leur permettant de saisir leurs prix et leurs quantités
> * En option l'intégration d'un service de location de marteaux d'occasion avec un partenaire qu'il nous reste à trouver
> * L'intégration avec notre outil CRM maison "SugarForce", codé en Delphi par Mr Paul, ancien interne polyvalent décédé depuis
> * Un *dacheborde*, parcequ'il parait que cela booste la productivité des forces de vente
> * Avec bien entendu des widgets 2.0 pour dynamiser l'ensemble

Non seulement c'est peu précis, vague, mal défini, mais quand vous lisez la dernière ligne, généralement l'envie vous prend d'arrêter ce métier séance tenante pour partir élever des chèvres dans le Larzac&nbsp;:

> Pouvez-vous me fournir un devis *à tiroirs* et vous engager sur une livraison  à la rentrée prochaine&nbsp;?
>
> PS&nbsp;: Je serai absent du 1er juillet au 31 août, voyez avec ma secrétaire (en congés du 15/07 au 15/08) pour toute questions complémentaires
> PPS&nbsp;: Je vous ai parlé de l'application Blackberry&nbsp;?

Peut-on imaginer comparer ce type de demande à l'achat d'une *voiture* en concession&nbsp;?

Allez, j'ai dix minutes à tuer, je vous imagine la discussion&nbsp;:

<div style="float:right;margin:0 0 10px 10px;text-align:center">
  <a href="http://www.flickr.com/photos/ferdinandreus/4647740287">
    <img src="http://farm5.static.flickr.com/4024/4647740287_4e7f6ab518_z.jpg" alt="fish" style="width:230px"/>
  </a>
  <br/>
  <small><a href="http://www.flickr.com/photos/ferdinandreus/4647740287/">fish</a>, par <a href="http://www.flickr.com/photos/ferdinandreus/">ferdinandreus</a></small>
</div>

> — Bonjour monsieur le concessionnaire
>
> — Bonjour monsieur le client
>
> — Je voudrais acheter une voiture
>
> — Ma foi, vous êtes au bon endroit&nbsp;! Quel modèle vous a tapé dans l'oeil&nbsp;?
>
> — Je veux quelque chose d'assez standard, comme celle-ci là bas, mais avec quelques ajustements mineurs&nbsp;; j'aime bien l'arrière de celle-ci, l'avant de celle-là, l'aspect cabriolet de la petite là-bas, et le bas de caisse de celle cachée dans le fond, là. Il faudra aussi qu'elle soit amphibie, je compte aller pêcher avec quelques amis le week-end prochain. Idéalement, elle pourra également passer d'un mode cabriolet à mobile-home d'une simple pression sur un bouton en cas d'embouteillages prolongés. Avec le meilleur moteur que vous ayez à disposition, cela va sans dire. Ah, précisons tout de suite&nbsp;: il me la faut pour le week-end prochain, puisque j'ai une partie de pêche, vous vous souvenez&nbsp;? Bien entendu, je me résèrve le droit de vous demander dans ce laps de temps quelques options supplémentaires auxquelles je n'ai pas pensé. Vous avez le tarif catalogue sous la main&nbsp;?
>
> — *PAN&nbsp;!* (bruit de déflagration)

Redevenons sérieux deux secondes. **Le développement d'une application Web sera *toujours* spécifique et sur-mesures, arrêtons de nourrir l'illusion qu'en utilisant des outils Open Source relativement standardisés *techniquement*, nous standardisons *fonctionnellement* les développements.** Ce n'est tout simplement pas vrai 99% du temps.

Et pour les fans de maquillage d'outils tout-prêts et autres produits industrial-wanabee, j'utilise souvent la formule suivante auprès de mes clients&nbsp;:

> Un développement spécifique adaptera l'outil à votre métier&nbsp;; un CMS adaptera votre métier à l'outil. La balle est dans votre camp (ou accessoirement dans votre pied.)

Ce qui m'amène à un deuxième constat que je fais de plus en plus au gré des avant-ventes&nbsp;; il existe bel et bien deux métiers distincts, que beaucoup de prospects (et hélas, soyons francs, de prestataires) confondent allégrement&nbsp;:

 - le métier *d'intégrateur* de solutions&nbsp;;
 - le métier de *concepteur* de solutions spécifiques.

J'identifie la part de demandes entrantes du premier type de prestation à environ 80%, si ce n'est plus. J'ai personnellement décidé en créant mon activité de me consacrer exclusivement aux 20% restants. Et ma vie a changé, en plus mieux. Juste pour dire.

### «&nbsp;Parle pas aux cons, ça les instruit&nbsp;»

> La moindre tentative de développement modulaire et par priorité sera rejetée et incomprise.
>
> Les méthodes agiles seront rejetées par la grande majorité des clients par peur. J’en viens même à penser que c’est une perte de temps d’en parler.

Oui, n'en parlons plus et subissons sans broncher, c'est plus confortable intellectuellement. Et puis si ça se vend plus facilement comme ça, pourquoi diable hésiter&nbsp;? Faut juste s'habituer à marcher en canard au troisième recommandé avec AR. Ah mais oui je suis con, le commercial ayant vendu la chose a déjà touché sa comm' et ne gère plus les conséquences de sa vente depuis longtemps, j'oubliais.

<p>
  <a href="http://www.flickr.com/photos/stumayhew/3747070194" title="The Fear">
    <img src="http://farm4.static.flickr.com/3434/3747070194_16a125d4ea_z.jpg" alt="The Fear"/>
  </a>
  <br/>
  <small><a href="http://www.flickr.com/photos/stumayhew/3747070194">The Fear</a>, par <a href="http://www.flickr.com/photos/stumayhew/">stumayhew</a></small>
</p>

Sérieusement, il faut se battre. Il faut chercher à convaincre, expliquer sans relâche. Et en cas de blocage rhédibitoire, ne rien lâcher, **car d'expérience quelqu'un qui n'accepte aucune concession sur un plan méthodologique ne vous passera vraisemblablement *rien* sur les aspects commerciaux.**

> De plus dans les méthodes de développement modulaires et surtout évolutives, les litiges sont beaucoup plus complexes à gérer.

Si litige il y a, c'est vraisemblablement que les principes fondamentaux de l'agilité n'ont jamais été appliqués sur le projet en question. Quelques rappels issus du [manifeste agile](http://agilemanifesto.org/)&nbsp;:

 1. **Les individus et leurs interactions** plus que les processus et les outils
 2. **Des logiciels opérationnels** plus qu’une documentation exhaustive
 3. **La collaboration avec les clients** plus que la négociation contractuelle
 4. **L’adaptation au changement** plus que le suivi d’un plan

Vous avez noté le point 3&nbsp;? Ah ben zut. Et je vous parle pas des trois autres, j'imagine que la lecture du compte-rendu de la décision de justice post-echec-projet vous accapare déjà un temps précieux.

Enfin, j'aimerai bien savoir qu'est ce qui rend les litiges plus évidents à gérer à grands coups d'avenants avec A/R sur un forfait plutôt qu'un bon vieux dialogue autour d'une table dans le cadre d'un projet agile&nbsp;?

Gérer des litiges contractuels est un véritable métier, très pointu, qui demande de grosses compétences et un sang-froid certain. Ce métier ne me passionne personnellement pas, et je ne peux me résoudre à le considérer comme une fatalité inhérente à mon corps de métier. Je suis là pour fournir des réponses à des besoins précis, quitte à fournir une assistance pour faciliter leur formulation, dans la collaboration et le respect mutuel, au travers d'une communication de type horizontal. **J'axe toute relation avant tout sur la confiance.** Libre à chacun de se raconter que tout ceci n'est qu'utopie, mais force est de constater qu'après un an d'activité je trouve des gens (des clients pardon, je crois que je m'y ferai jamais) qui embrassent cette manière de fonctionner. Avec d'excellents résultats, par ailleurs.

Par contre, il est clair qu'avec de telles exigences, je ne donne pas suite à neuf appels entrants sur dix. Le mot est lâché&nbsp;: **je refuse des opportunités business**. SACRILÈGE&nbsp;! Combien de gens me regardent avec des yeux ronds lorsque je raconte ça… C'est déprimant, d'un certain côté. Travailler plus pour gagner plus&nbsp;? **Et si on parlait plutôt de *travailler mieux pour vivre mieux*&nbsp;?**

<p>
  <a href="http://twitter.com/laurentLC/status/28895308381">
    <img src="http://media.tumblr.com/tumblr_layfxpSlVV1qbt2jc.png" alt="Avoir le temps…"/>
  </a>
</p>

### *Courir plus pour s'essouffler plus*

> (…) si ça implique une absence de visibilité sur une enveloppe globale sur laquelle on s’engage, (c')est tout simplement rédhibitoire pour le client

La visibilité s'obtient par la connaissance de la capacité à produire en collaboration avec le client (on appelle ça la *vélocité*, dans le jargon agile). **C'est complètement utopique de prétendre estimer une capacité à produire sans connaître la capacité du client à fournir les éléments nécessaires à l'obtention de cette productivité dans la collaboration**. Et par pitié, qu'on ne me parle pas du cahier des charges de 400 pages que personne ne lit puisqu'obsolète au bout d'une semaine, le besoin ayant déjà changé par trois fois suite à la remontée de l'avis du numéro deux groupe/worldwide et de sa cousine Berthe qui est en deuxième année aux Gobelins.

Enfin, je réalise que beaucoup de gens comprennent l'*agilité* comme la capacité à faire du business malgré tout, voire à tomber du projet coûte que coûte, en s'adaptant aux obstacles au gré du vent et avec les moyens du bord (qui prennent souvent la forme de *stagiaires chef de projet* et autres *experts techniques junior* recrutés à [la râche](http://www.risacher.com/la-rache/index.php?z=2) pour faire face à un surcroît de charge non prévue, soit dit en passant). C'est juste tout l'inverse&nbsp;; **je ne connais rien de plus structurant et contraignant en termes de processus que les méthodes agiles&nbsp;!** Il n'y a pas de vaudou, l'obtention de résultats est à ce prix. Ainsi que d'une certaine façon, au prix d'un lâcher-prise et d'une certaine acceptation du changement, de chaque côté de la barrière (si tant est qu'il y en ait une).

<p>
  <a href="http://www.flickr.com/photos/beginasyouare/549652478/" title="High Wire Act">
    <img src="http://farm2.static.flickr.com/1235/549652478_ca4758c99c_z.jpg" alt="High Wire Act"/>
  </a>
  <br/>
  <small><a href="http://www.flickr.com/photos/beginasyouare/549652478/">High Wire Act</a>, par <a href="http://www.flickr.com/photos/beginasyouare/">beginasyouare</a></small>
</p>

### «&nbsp;Bon, tu conclues là&nbsp;? J'vais rater l'apéro&nbsp;»

Oui, je suis un peu décontenancé à la lecture de ces quelques commentaires. On constate tous que bien des commanditaires ne comprennent pas les enjeux de leur métier d'acheteur de prestation de développements informatiques. Je découvre qu'il est des professionnels tellement désabusés qu'ils ont visiblement renoncé à toute vélléité d'éducation de leurs prospects sur les questions d'organisation méthodologique et collaborative du travail, part intégrante du champ d'expertise de tout prestataire de développement informatique un tant soit peu digne de ce nom et prétendant offrir un conseil de qualité. Je ne peux me résoudre à croire qu'ils n'ont pas le choix, que tout ceci est inévitable, et que «&nbsp;c'est la crise, il faut bien bouffer, ma pauvre dame&nbsp;».

**Je pense au contraire qu'une part importante de notre métier, j'irai même jusqu'à parler de notre devoir déontologique, est de les accompagner dans la compréhension de leur rôle dans les processus collaboratifs projet afin de maximiser le potentiel de réussite de ces derniers coûte que coûte.** Et d'[apprendre à dire non](http://www.alistapart.com/articles/no-one-nos-learning-to-say-no-to-bad-ideas/) lorsque cela s'avère nécessaire, plutôt que de s'engluer dans cette vision fataliste, nivelant par le bas la qualité globale d'une partie grandissante des réalisations auquel le Web est confronté (france.fr anyone?).

Vous pouvez maintenant basher <del>en commentaire</del> [par email](/contact), c'est fait pour ça.
