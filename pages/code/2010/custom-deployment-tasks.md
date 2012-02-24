title: Tâches de déploiement spécifiques avec Symfony
date: 2010-05-25
tags: symfony, deploy, hosting
published: true

[Symfony](http://www.symfony-project.org/) propose une tâche de déploiement distant utilisant [`rsync`](http://fr.wikipedia.org/wiki/Rsync) fort pratique&nbsp;: une fois configurés les [paramètres du serveur distant](http://www.symfony-project.org/jobeet/1_4/Doctrine/en/22#chapter_22_deploying) dans le fichier `config/properties.ini` de votre projet, un simple appel en ligne de commande synchronisera les fichiers du projet présents sur votre système de fichiers local vers l'hôte distant. Et si vous utilisez une [clé SSH](http://prendreuncafe.com/blog/post/2005/08/29/262-installer-sa-cle-ssh-sur-un-serveur-distant), l'opération ne vous demandera même pas de saisir votre mot de passe&nbsp;!

    $ ./symfony project:deploy monserveur --go

Mais bien souvent, nous avons besoin de plus&nbsp;: préparer un certain nombre de fichiers statiques comme les assets CSS, JavaScript ou les images, ou vider le cache sur la ou les machines distantes pour prendre en compte d'éventuelles modifications de la configuration ou du templating sur la plateforme de production (qui exploite l'environnement du même nom, nous sommes bien d'accord).

Aussi, il est très simple de faire face à ces besoins spécifiques en créant vous même une tâche de déploiement projet, en surclassant la classe `sfProjectDeployTask` fournie en standard par Symfony. Par exemple, voici la tâche de déploiement que j'utilise pour la mise à jour du site [Akei](http://www.akei.com/), exploitant mon plugin [`npAssetsOptimizerPlugin`](http://github.com/n1k0/npAssetsOptimizerPlugin) pour la gestion de la minification et l'assemblage des fichiers JavaScript, CSS et images PNG &nbsp;:

    <?php
    class AkeiDeployTask extends sfProjectDeployTask
    {
      /**
       * @see sfProjectDeployTask
       */
      protected function configure()
      {
        $this->addArguments(array(
          new sfCommandArgument('server', sfCommandArgument::REQUIRED, 'The server name'),
        ));

        $this->addOptions(array(
          new sfCommandOption('go', null, sfCommandOption::PARAMETER_NONE, 'Do the deployment'),
          new sfCommandOption('rsync-dir', null, sfCommandOption::PARAMETER_REQUIRED, 'The directory where to look for rsync*.txt files', 'config'),
          new sfCommandOption('rsync-options', null, sfCommandOption::PARAMETER_OPTIONAL, 'To options to pass to the rsync executable', '-azC --force --delete --progress'),
          new sfCommandOption('optimize', null, sfCommandOption::PARAMETER_OPTIONAL, 'The asset optimizations to make before deploying'),
        ));

        $this->namespace = 'akei';
        $this->name = 'deploy';
        $this->briefDescription = 'Deploys Akei website to a given server';
      }

      /**
       * @see sfProjectDeployTask
       */
      protected function execute($arguments = array(), $options = array())
      {
        // Assets
        if (!is_null($options['optimize']))
        {
          $this->logSection('deploy', 'assets optimization before deploying');
          $task = new npOptimizeAssetsTask($this->dispatcher, $this->formatter);
          $task->run(array('application' => 'main'), array('type' => $options['optimize']));
        }

        // Deployment
        $this->logSection('deploy', 'deploying...');
        parent::execute($arguments, $options);

        // Remote symfony cc
        if ($options['go'])
        {
          $this->logSection('deploy', 'remote cache clear');
          $this->getFilesystem()->execute('ssh user@monserveur.foo "/path/to/www/akei/symfony cache:clear"');
        }

        $this->logSection('deploy', 'done.');
      }
    }

Comme vous pouvez le constater, cette tâche déclare un espace de nom `akei` et propose une option supplémentaire, `optimize`, permettant de préparer les assets avant déploiement&nbsp;:

    $ ./symfony akei:deploy monserveur --optimize=stylesheet --go

Cette commande va tout simplement minifier et assembler les feuilles de style définies par la configuration du plugin `npAssetsOptimizerPlugin`, déployer les fichiers en production sur la machine `monserveur` et vider le cache sur la machine distante une fois l'opération effectuée.

Notez d'ailleurs l'emploi du très pratique appel à `$this->getFilesystem()->execute()`, qui permet d'executer des appels à la ligne de commande locale depuis la classe de tâche elle-même&nbsp;; ici, une execution distante à travers SSH.

Bien entendu, cet exemple est très spécifique aux besoins du site Akei, mais vous pourriez en quelques minutes gérer plus finement une tâche de déploiement plus générique et configurable. Pensez-y pour vos projets ;)

PS&nbsp;: Ce billet a été écrit en 14 minutes. Merci de votre compréhension.
