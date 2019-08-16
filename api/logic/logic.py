from api import models
from api.extensions import sql
from api.logic.wrapper import Wrapper


def add_user(user, password):
    me = models.User(username=user, password=password)

    sql.session.add(me)
    sql.session.commit()


def add_show(show_id):
    x = Wrapper()
    y = x.show(show_id)

    if y['status'] == 'Ended':
        stat = True
    else:
        stat = False

    try:
        image = y['image']['medium']
    except TypeError:
        image = None

    s = models.Show(
        id=y['id'], name=y['name'], premiered=y['premiered'], status=stat, summary=y['summary'],
        image=image
    )
    sql.session.add(s)
    sql.session.commit()

    _add_seasons(s.id)
    _add_episodes(s.id)


def update_show(show):
    z = sql.session.query(models.Show).filter_by(name=show).first()

    x = Wrapper(show)
    y = x.query_show()

    if y['status'] == 'Ended':
        stat = True
    else:
        stat = False

    z.summary = y['summary']
    z.image = y['image']['medium']
    z.status = stat

    sql.session.add(z)
    sql.session.commit()


def _add_seasons(show_id):
    s = models.Show.query.get(show_id)

    seasons = Wrapper(s.name).seasons()

    for season in seasons:

        if season['name'] == "":
            season_name = None
        else:
            season_name = season['name']

        try:
            image = season['image']['medium']
        except TypeError:
            image = None

        x = models.Season(
            id=season['id'],
            show_id=s.id,
            number=season['number'],
            name=season_name,
            episodeOrder=season['episodeOrder'],
            premiereDate=season['premiereDate'],
            endDate=season['endDate'],
            image=image,
        )
        sql.session.add(x)

        sql.session.commit()


def _add_episodes(show_id):
    file = models.Show.query.get(show_id)

    episodes = Wrapper(file.name).episodes()

    for episode in episodes:

        try:
            image = episode['image']['medium']
        except TypeError:
            image = None

        x = models.Episode(
            id=episode['id'],
            air_date=episode['airdate'] if episode['airdate'] != '' else None,
            name=episode['name'],
            number=episode['number'],
            season=episode['season'],
            summary=episode['summary'],
            run_time=episode['runtime'],
            image=image,
            show_id=file.id,
        )

        sql.session.add(x)

        sql.session.commit()


def update_episodes(show):  # new episodes
    file = sql.session.query(models.Show).filter_by(name=show).first()
    episodes = Wrapper(show).episodes()

    for episode in episodes:
        x = sql.session.query(models.Episode).get(episode['id'])
        if x is None:
            x = models.Episode(
                id=episode['id'],
                air_date=episode['airdate'],
                name=episode['name'],
                number=episode['number'],
                season=episode['season'],
                summary=episode['summary'],
                run_time=episodes['runtime'],
                image=episode['image']['medium'],
                show_id=file.id,
            )
        else:
            try:
                x.image = episode['image']['medium']
            except TypeError:
                pass

        sql.session.add(x)

    sql.session.commit()


def subscribe(user_id, show_id):
    sub = models.Subscription(
        user_id=user_id,
        show_id=show_id
    )

    sql.session.add(sub)
    sql.session.commit()

    _subscribed_season(user_id, show_id)
    _subscribed_watched(user_id, show_id)


def _subscribed_season(user_id, show_id):
    seasons = models.Season.query.filter_by(show_id=show_id).all()

    for season in seasons:
        x = models.SeasonWatched(
            user_id=user_id,
            show_id=show_id,
            season_id=season.id
        )

        sql.session.add(x)

    sql.session.commit()


def _subscribed_watched(user_id, show_id):
    s = models.Show.query.get(show_id)

    for episode in s.episodes:
        season = models.Season.query.filter_by(show_id=show_id, number=episode.season).first()

        x = models.Watched(
            user_id=user_id,
            show_id=show_id,
            season_id=season.id,
            episode_id=episode.id
        )
        sql.session.add(x)

    sql.session.commit()


def watched(user_id, show_id, episode_id, watch_state):
    x = models.Watched.query.get((user_id, show_id, episode_id))

    x.watched = watch_state

    sql.session.add(x)
    sql.session.commit()
