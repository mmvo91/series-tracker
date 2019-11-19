import logging
from datetime import datetime

from api import models
from api.app import create_app
from api.extensions import sql
from api.logic import wrapper

app = create_app()
app.app_context().push()


def subscription_updates():
    """
    For all subscriptions, looks for new episodes in db to add as a episode for user
    """
    subscriptions = models.Subscription.query.all()

    for subscription in subscriptions:
        show_id = subscription.show_id
        user_id = subscription.user_id

        show = models.Show.query.get(show_id)
        seasons = models.Season.query.filter_by(show_id=show_id).all()

        for season in seasons:
            y = models.SeasonWatched.query.get((user_id, show_id, season.id))
            if y is None:
                x = models.SeasonWatched(
                    user_id=user_id,
                    show_id=show_id,
                    season_id=season.id
                )

                sql.session.add(x)

            episodes = models.Episode.query.filter_by(show_id=show_id, season=season.number)
            for episode in episodes:
                z = models.Watched.query.get((user_id, show_id, episode.id))
                if z is None:
                    new = models.Watched(
                        user_id=user_id,
                        show_id=show_id,
                        season_id=season.id,
                        episode_id=episode.id,
                    )

                    sql.session.add(new)

        sql.session.commit()


def show_update():
    """
    For all existing shows in db, look for new episodes and add into db
    """
    shows = models.Show.query.all()

    for show in shows:
        maze = wrapper.Wrapper()
        s = maze.show(show.id)
        seasons = maze.seasons()
        episodes = maze.episodes()

        if s['status'] == 'Ended':
            status = True
        else:
            status = False

        try:
            image = s['image']['medium']
        except TypeError:
            image = None

        if show.status is not status:
            show.status = status
            print(f'{show.name} ended has become {status}')
        if show.summary != s['summary']:
            show.summary = s['summary']
            print(f'{show.name} has a new summary')
        if show.image != image:
            show.image = image
            print(f'{show.name} has a new image')

        for season in seasons:
            if season['name'] == "":
                season_name = None
            else:
                season_name = season['name']

            try:
                image = season['image']['medium']
            except TypeError:
                image = None

            y = models.Season.query.get(season['id'])

            if season['premiereDate'] != '' and season['premiereDate'] is not None:
                premiere = datetime.strptime(season['premiereDate'], '%Y-%m-%d').date()
            else:
                premiere = None

            if season['endDate'] != '' and season['endDate'] is not None:
                end = datetime.strptime(season['endDate'], '%Y-%m-%d').date()
            else:
                end = None

            x = models.Season(
                id=season['id'],
                show_id=show.id,
                number=season['number'],
                name=season_name,
                episodeOrder=season['episodeOrder'],
                premiereDate=premiere,
                endDate=end,
                image=image,
            )

            if y is None:
                print(f'{show.name} has a new season {x.number}')
                sql.session.add(x)
            else:
                if y.name != x.name:
                    y.name = x.name
                    print(f'{show.name} Season {y.number} has a new name: {x.name}')

                if y.image != x.image:
                    y.image = x.image
                    print(f'{show.name} Season {y.number} has a new image: {x.image}')

        for episode in episodes:
            try:
                image = episode['image']['medium']
            except TypeError:
                image = None

            y = models.Episode.query.get(episode['id'])

            x = models.Episode(
                id=episode['id'],
                air_date=datetime.strptime(episode['airdate'], '%Y-%m-%d') if episode['airdate'] != '' else None,
                name=episode['name'],
                number=episode['number'],
                season=episode['season'],
                summary=episode['summary'] if episode['summary'] != '' else None,
                run_time=episode['runtime'],
                image=image,
                show_id=show.id,
            )

            if y is None:
                sql.session.add(x)
                print(f'{show.name} has a new episode {x.name}')
            else:
                if y.air_date != x.air_date:
                    y.air_date = x.air_date
                    print(f'{show.name} Episode {y.name} has a new air date: {x.air_date}')

                if y.name != x.name:
                    print(f'{show.name} Episode {y.name} has a new name: {x.name}')
                    y.name = x.name

                if y.summary != x.summary:
                    y.summary = x.summary
                    print(f'{show.name} Episode {y.name} has a new summary: {x.summary}')

                if y.image != x.image:
                    y.image = x.image
                    print(f'{show.name} Episode {y.name} has a new image: {x.image}')

        sql.session.commit()


if __name__ == '__main__':
    show_update()
    subscription_updates()
